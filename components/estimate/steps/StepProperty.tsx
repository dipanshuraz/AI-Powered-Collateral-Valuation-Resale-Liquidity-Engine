"use client";

import { Field } from "@ark-ui/react/field";
import { useEstimateForm } from "@/contexts/EstimateFormContext";

export function StepProperty() {
  const { form, setForm } = useEstimateForm();
  return (
    <div className="space-y-6">
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        Property type, size, and age drive depreciation and fungibility.
      </p>
      <div className="grid grid-cols-2 gap-6">
        <Field.Root>
          <Field.Label className="text-xs text-neutral-500">Property type</Field.Label>
          <Field.Select
            className="field-select"
            value={form.propertyType}
            onChange={(e) => setForm({ propertyType: e.target.value })}
          >
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="industrial">Industrial</option>
          </Field.Select>
        </Field.Root>
        <Field.Root>
          <Field.Label className="text-xs text-neutral-500">Sub-type</Field.Label>
          <Field.Select
            className="field-select"
            value={form.subType}
            onChange={(e) => setForm({ subType: e.target.value })}
          >
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="plot">Plot</option>
            <option value="shop">Shop</option>
            <option value="warehouse">Warehouse</option>
            <option value="other">Other</option>
          </Field.Select>
        </Field.Root>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <Field.Root>
          <Field.Label className="text-xs text-neutral-500">Size (sqft)</Field.Label>
          <Field.Input
            required
            type="number"
            min={1}
            step={1}
            className="field"
            value={form.sizeSqft}
            onChange={(e) => setForm({ sizeSqft: e.target.value })}
          />
        </Field.Root>
        <Field.Root>
          <Field.Label className="text-xs text-neutral-500">Age bucket</Field.Label>
          <Field.Select
            className="field-select"
            value={form.ageBucket}
            onChange={(e) => setForm({ ageBucket: e.target.value })}
          >
            <option value="new">New (&lt;5y)</option>
            <option value="mid">Mid (5–15y)</option>
            <option value="old">Old (&gt;15y)</option>
          </Field.Select>
        </Field.Root>
      </div>
    </div>
  );
}
