"use client";

import { Checkbox } from "@ark-ui/react/checkbox";
import { Collapsible } from "@ark-ui/react/collapsible";
import { Field } from "@ark-ui/react/field";
import { useEstimateForm } from "@/contexts/EstimateFormContext";

const checkboxControlClass =
  "flex h-4 w-4 shrink-0 items-center justify-center rounded border border-neutral-300 dark:border-neutral-600 " +
  "data-[state=checked]:border-emerald-600 data-[state=checked]:bg-emerald-600 data-[state=checked]:text-white";

export function StepAdvanced() {
  const { form, setForm } = useEstimateForm();
  return (
    <div className="space-y-6">
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        Legal, occupancy, optional listing feeds (cookies in env), and collateral
        notes.
      </p>

      <div className="grid grid-cols-2 gap-6">
        <Field.Root>
          <Field.Label className="text-xs text-neutral-500">Floor</Field.Label>
          <Field.Input
            type="number"
            className="field"
            value={form.floor}
            onChange={(e) => setForm({ floor: e.target.value })}
          />
        </Field.Root>
        <div className="flex flex-col justify-end pb-1">
          <Checkbox.Root
            checked={form.hasLift}
            onCheckedChange={(d) =>
              setForm({ hasLift: d.checked === true })
            }
            className="flex items-center gap-2"
          >
            <Checkbox.Control className={checkboxControlClass}>
              <Checkbox.Indicator className="text-[10px] leading-none">✓</Checkbox.Indicator>
            </Checkbox.Control>
            <Checkbox.Label className="text-xs text-neutral-600 dark:text-neutral-400">
              Lift access
            </Checkbox.Label>
            <Checkbox.HiddenInput />
          </Checkbox.Root>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Field.Root>
          <Field.Label className="text-xs text-neutral-500">Tenure</Field.Label>
          <Field.Select
            className="field-select"
            value={form.tenure}
            onChange={(e) => setForm({ tenure: e.target.value })}
          >
            <option value="freehold">Freehold</option>
            <option value="leasehold">Leasehold</option>
          </Field.Select>
        </Field.Root>
        <Field.Root>
          <Field.Label className="text-xs text-neutral-500">Title clarity</Field.Label>
          <Field.Select
            className="field-select"
            value={form.titleClarity}
            onChange={(e) => setForm({ titleClarity: e.target.value })}
          >
            <option value="clear">Clear</option>
            <option value="uncertain">Uncertain</option>
          </Field.Select>
        </Field.Root>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Field.Root>
          <Field.Label className="text-xs text-neutral-500">Occupancy</Field.Label>
          <Field.Select
            className="field-select"
            value={form.occupancy}
            onChange={(e) => setForm({ occupancy: e.target.value })}
          >
            <option value="self_occupied">Self-occupied</option>
            <option value="rented">Rented</option>
            <option value="vacant">Vacant</option>
          </Field.Select>
        </Field.Root>
        <Field.Root>
          <Field.Label className="text-xs text-neutral-500">Rental yield %</Field.Label>
          <Field.Input
            type="number"
            step={0.1}
            className="field"
            value={form.yieldPct}
            onChange={(e) => setForm({ yieldPct: e.target.value })}
          />
        </Field.Root>
      </div>

      <Checkbox.Root
        checked={form.includeAi}
        onCheckedChange={(d) => setForm({ includeAi: d.checked === true })}
        className="flex items-center gap-2"
      >
        <Checkbox.Control className={checkboxControlClass}>
          <Checkbox.Indicator className="text-[10px] leading-none">✓</Checkbox.Indicator>
        </Checkbox.Control>
        <Checkbox.Label className="text-xs text-neutral-600 dark:text-neutral-400">
          AI summary (requires OPENAI_API_KEY on server)
        </Checkbox.Label>
        <Checkbox.HiddenInput />
      </Checkbox.Root>

      <Collapsible.Root defaultOpen={false} className="rounded-lg border border-neutral-200 bg-neutral-50/80 dark:border-neutral-700 dark:bg-neutral-900/40">
        <Collapsible.Trigger className="flex w-full cursor-pointer items-center justify-between gap-2 px-3 py-2.5 text-left text-xs font-medium text-neutral-700 outline-none hover:bg-neutral-100/80 dark:text-neutral-300 dark:hover:bg-neutral-800/50">
          <span>Listing feeds (optional)</span>
          <Collapsible.Indicator className="text-neutral-500 transition-transform data-[state=open]:rotate-180">
            ▾
          </Collapsible.Indicator>
        </Collapsible.Trigger>
        <Collapsible.Content className="px-3 pb-3 pt-0">
          <div className="space-y-3 border-t border-neutral-200/80 pt-3 text-xs dark:border-neutral-700">
            <FeedCheckbox
              label="MagicBricks"
              checked={form.mbEnabled}
              onCheckedChange={(v) => setForm({ mbEnabled: v })}
            />
            {form.mbEnabled && (
              <div className="grid gap-2 border-l-2 border-neutral-200 pl-3 dark:border-neutral-600">
                <div className="grid grid-cols-2 gap-2">
                  <Field.Root>
                    <Field.Input
                      className="field font-mono text-[10px]"
                      placeholder="City id"
                      value={form.mbCityId}
                      onChange={(e) => setForm({ mbCityId: e.target.value })}
                    />
                  </Field.Root>
                  <Field.Root>
                    <Field.Input
                      className="field font-mono text-[10px]"
                      placeholder="Locality id"
                      value={form.mbLocalityId}
                      onChange={(e) => setForm({ mbLocalityId: e.target.value })}
                    />
                  </Field.Root>
                </div>
                <Field.Root>
                  <Field.Input
                    className="field font-mono text-[10px]"
                    placeholder="Or paste propertySearch URL"
                    value={form.mbSearchUrl}
                    onChange={(e) => setForm({ mbSearchUrl: e.target.value })}
                  />
                </Field.Root>
              </div>
            )}
            <FeedRow
              label="99acres"
              enabled={form.feed99Enabled}
              url={form.feed99Url}
              onEnabled={(v) => setForm({ feed99Enabled: v })}
              onUrl={(v) => setForm({ feed99Url: v })}
            />
            <FeedRow
              label="Housing.com"
              enabled={form.housingFeedEnabled}
              url={form.housingFeedUrl}
              onEnabled={(v) => setForm({ housingFeedEnabled: v })}
              onUrl={(v) => setForm({ housingFeedUrl: v })}
            />
            <FeedRow
              label="NoBroker"
              enabled={form.nobrokerFeedEnabled}
              url={form.nobrokerFeedUrl}
              onEnabled={(v) => setForm({ nobrokerFeedEnabled: v })}
              onUrl={(v) => setForm({ nobrokerFeedUrl: v })}
            />
          </div>
        </Collapsible.Content>
      </Collapsible.Root>

      <div className="space-y-2">
        <p className="text-[10px] uppercase tracking-wide text-neutral-400">
          Collateral context
        </p>
        <Field.Root>
          <Field.Label className="text-[10px] text-neutral-500">Location notes</Field.Label>
          <Field.Textarea
            className="field min-h-[3rem] resize-none text-xs"
            rows={2}
            value={form.locationNotes}
            onChange={(e) => setForm({ locationNotes: e.target.value })}
          />
        </Field.Root>
        <Field.Root>
          <Field.Label className="text-[10px] text-neutral-500">Legal / RERA</Field.Label>
          <Field.Textarea
            className="field min-h-[3rem] resize-none text-xs"
            rows={2}
            value={form.legalNotes}
            onChange={(e) => setForm({ legalNotes: e.target.value })}
          />
        </Field.Root>
        <Field.Root>
          <Field.Label className="text-[10px] text-neutral-500">Documents summary</Field.Label>
          <Field.Textarea
            className="field min-h-[3rem] resize-none text-xs"
            rows={2}
            value={form.docsSummary}
            onChange={(e) => setForm({ docsSummary: e.target.value })}
          />
        </Field.Root>
      </div>
    </div>
  );
}

function FeedCheckbox({
  label,
  checked,
  onCheckedChange,
}: {
  label: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <Checkbox.Root
      checked={checked}
      onCheckedChange={(d) => onCheckedChange(d.checked === true)}
      className="flex items-center gap-2"
    >
      <Checkbox.Control className={checkboxControlClass}>
        <Checkbox.Indicator className="text-[10px] leading-none">✓</Checkbox.Indicator>
      </Checkbox.Control>
      <Checkbox.Label>{label}</Checkbox.Label>
      <Checkbox.HiddenInput />
    </Checkbox.Root>
  );
}

function FeedRow({
  label,
  enabled,
  url,
  onEnabled,
  onUrl,
}: {
  label: string;
  enabled: boolean;
  url: string;
  onEnabled: (v: boolean) => void;
  onUrl: (v: string) => void;
}) {
  return (
    <div className="border-l-2 border-neutral-200 pl-3 dark:border-neutral-600">
      <Checkbox.Root
        checked={enabled}
        onCheckedChange={(d) => onEnabled(d.checked === true)}
        className="flex items-center gap-2"
      >
        <Checkbox.Control className={checkboxControlClass}>
          <Checkbox.Indicator className="text-[10px] leading-none">✓</Checkbox.Indicator>
        </Checkbox.Control>
        <Checkbox.Label>{label}</Checkbox.Label>
        <Checkbox.HiddenInput />
      </Checkbox.Root>
      {enabled && (
        <Field.Root className="mt-1">
          <Field.Input
            className="field font-mono text-[10px]"
            placeholder="Search JSON URL"
            value={url}
            onChange={(e) => onUrl(e.target.value)}
          />
        </Field.Root>
      )}
    </div>
  );
}
