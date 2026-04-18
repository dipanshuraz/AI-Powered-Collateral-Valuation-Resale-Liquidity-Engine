from __future__ import annotations

import logging
from functools import lru_cache
from typing import Dict, List, Optional, Tuple

import httpx
from geopy.distance import geodesic
from geopy.geocoders import Nominatim

logger = logging.getLogger(__name__)

DEFAULT_DISTANCE_METERS = 2000
SEARCH_RADIUS_METERS = 3000
PUNE_FALLBACK_LAT = 18.5204
PUNE_FALLBACK_LON = 73.8567
NOMINATIM_USER_AGENT = "real-estate-collateral-location-engine"
OVERPASS_URL = "https://overpass-api.de/api/interpreter"
OVERPASS_URLS = [
    "https://overpass-api.de/api/interpreter",
    "https://lz4.overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
]


@lru_cache(maxsize=1)
def get_geolocator() -> Nominatim:
    return Nominatim(user_agent=NOMINATIM_USER_AGENT, timeout=10)


@lru_cache(maxsize=256)
def address_to_latlon(address: str) -> Tuple[float, float]:
    location = get_geolocator().geocode(address)
    if location is None:
        raise ValueError(f"Could not geocode address: {address}")
    return float(location.latitude), float(location.longitude)


def _build_overpass_query(lat: float, lon: float, tag: str) -> str:
    key, value = tag.split("=", maxsplit=1)
    return f"""
    [out:json][timeout:15];
    (
      node["{key}"="{value}"](around:{SEARCH_RADIUS_METERS},{lat},{lon});
      way["{key}"="{value}"](around:{SEARCH_RADIUS_METERS},{lat},{lon});
      relation["{key}"="{value}"](around:{SEARCH_RADIUS_METERS},{lat},{lon});
    );
    out center;
    """.strip()


def get_nearby_places(lat: float, lon: float, tag: str) -> List[Tuple[float, float]]:
    query = _build_overpass_query(lat, lon, tag)
    payload = None
    last_exception: Exception | None = None

    for endpoint in OVERPASS_URLS:
        try:
            response = httpx.post(
                endpoint,
                data={"data": query},
                headers={"Accept": "application/json"},
                timeout=20.0,
            )
            response.raise_for_status()
            payload = response.json()
            break
        except Exception as exc:  # pragma: no cover - external API path
            last_exception = exc
            logger.warning("Overpass lookup failed for %s via %s: %s", tag, endpoint, exc)

    if payload is None:
        if last_exception:
            logger.warning("All Overpass endpoints failed for %s; using default distances", tag)
        return []

    places: List[Tuple[float, float]] = []
    for element in payload.get("elements", []):
        if "lat" in element and "lon" in element:
            places.append((float(element["lat"]), float(element["lon"])))
        elif "center" in element:
            places.append((float(element["center"]["lat"]), float(element["center"]["lon"])))
    return places


def compute_min_distance(lat: float, lon: float, places: List[Tuple[float, float]]) -> int:
    if not places:
        return DEFAULT_DISTANCE_METERS
    base = (lat, lon)
    min_distance = min(geodesic(base, place).meters for place in places)
    return int(round(min_distance))


def _distance_to_score(distance_meters: int) -> float:
    capped = min(max(distance_meters, 0), DEFAULT_DISTANCE_METERS)
    return 100 * (1 - (capped / DEFAULT_DISTANCE_METERS))


@lru_cache(maxsize=256)
def _cached_geo_lookup(lat_key: float, lon_key: float) -> Dict[str, int]:
    metro_places = get_nearby_places(lat_key, lon_key, "railway=station")
    hospital_places = get_nearby_places(lat_key, lon_key, "amenity=hospital")
    school_places = get_nearby_places(lat_key, lon_key, "amenity=school")

    dist_metro = compute_min_distance(lat_key, lon_key, metro_places)
    dist_hospital = compute_min_distance(lat_key, lon_key, hospital_places)
    dist_school = compute_min_distance(lat_key, lon_key, school_places)

    metro_score = _distance_to_score(dist_metro)
    hospital_score = _distance_to_score(dist_hospital)
    school_score = _distance_to_score(dist_school)
    location_score = int(round(0.4 * metro_score + 0.3 * hospital_score + 0.3 * school_score))

    return {
        "dist_metro": dist_metro,
        "dist_hospital": dist_hospital,
        "dist_school": dist_school,
        "location_score": max(0, min(location_score, 100)),
    }


def location_intelligence(
    lat: Optional[float] = None,
    lon: Optional[float] = None,
    address: Optional[str] = None,
) -> Dict[str, float | int]:
    resolved_lat = lat
    resolved_lon = lon

    if (resolved_lat is None or resolved_lon is None) and address:
        try:
            resolved_lat, resolved_lon = address_to_latlon(address)
        except Exception as exc:  # pragma: no cover - external API path
            logger.warning("Address geocoding failed for '%s': %s", address, exc)

    if resolved_lat is None or resolved_lon is None:
        logger.warning("Falling back to Pune center coordinates for location intelligence")
        resolved_lat = PUNE_FALLBACK_LAT
        resolved_lon = PUNE_FALLBACK_LON

    try:
        geo = _cached_geo_lookup(round(float(resolved_lat), 4), round(float(resolved_lon), 4))
    except Exception as exc:  # pragma: no cover - defensive path
        logger.warning("Location intelligence failed, using default distances: %s", exc)
        geo = {
            "dist_metro": DEFAULT_DISTANCE_METERS,
            "dist_hospital": DEFAULT_DISTANCE_METERS,
            "dist_school": DEFAULT_DISTANCE_METERS,
            "location_score": 0,
        }

    return {
        "lat": float(resolved_lat),
        "lon": float(resolved_lon),
        **geo,
    }
