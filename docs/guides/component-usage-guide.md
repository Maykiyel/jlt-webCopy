# Component Usage Guide

This guide explains how to use the reusable UI components in this project.

## 1. AppButton

Use `AppButton` for consistent call-to-action and secondary actions.

### Props you will use most

- `type`: `"button" | "submit" | "reset"`
- `loading`: shows loader and disables click
- `disabled`: disables interaction
- `icon`: optional custom icon component
- `form`: submits a specific form by id

### Example

```tsx
<AppButton variant="primary" type="submit" loading={isSaving}>
  Save Changes
</AppButton>
```

### Notes

- Primary button uses a default arrow icon if no `icon` is passed.
- `loading` automatically prevents duplicate clicks.

---

## 2. PageCard

Use `PageCard` as the standard page shell.

### What it gives you

- Back button behavior
- Title and optional subtext
- Optional right-side action area
- Body container for page content

### Example

```tsx
<PageCard
  title="Account Settings"
  subtext="Profile"
  action={<AppButton onClick={onSave}>Save</AppButton>}
>
  <ProfileForm />
</PageCard>
```

### Back behavior

- If `onBack` is provided, it is used.
- Otherwise it navigates to previous route.

Use `fullHeight` for viewport-filling pages:

```tsx
<PageCard title="Dashboard" fullHeight>
  <DashboardContent />
</PageCard>
```

---

## 3. DetailCard

Use `DetailCard` for read-only grouped information.

### Best use cases

- Customer details
- Quotation metadata
- Billing sections

### Example

```tsx
<DetailCard icon={<PersonIcon />} title="Customer Details">
  <DetailGrid rows={rows} />
</DetailCard>
```

---

## 4. DetailGrid

Use `DetailGrid` to render label/value rows.

### Props

- `rows`: `{ label, value }[]`
- `labelWidth`: optional width for consistent label alignment

### Example

```tsx
const rows = [
  { label: "Client Name", value: client.name },
  { label: "Status", value: client.status },
  { label: "Created At", value: formatDate(client.createdAt) },
];

<DetailGrid rows={rows} labelWidth="10rem" />;
```

You can pass React elements as `value` (badges, links, custom text).

---

## 5. AppTable

Use `AppTable` for list screens.

### Core props

- `columns`
- `data`
- `rowKey`
- `actions`
- `withEntryControls`
- `perPage`, `onPerPageChange`
- `total`, `showingCount`
- `searchValue`, `onSearchChange`, `onSearch`
- `onRowClick`

### Example

```tsx
const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  {
    key: "status",
    label: "Status",
    type: "select",
    selectOptions: ["Active", "Inactive"],
    onSelectChange: (row, value) => updateStatus(row.id, value),
    selectValue: (row) => row.status,
  },
];

const actions = [
  { label: "View", onClick: (row) => openDetails(row.id) },
  { label: "Delete", color: "red", onClick: (row) => removeRow(row.id) },
];

<AppTable
  columns={columns}
  data={users}
  rowKey={(row) => row.id}
  actions={actions}
  withEntryControls
  perPage={perPage}
  onPerPageChange={setPerPage}
  total={totalFromApi}
  showingCount={countFromApi}
  searchValue={search}
  onSearchChange={setSearch}
  onSearch={fetchUsers}
  onRowClick={(row) => openDetails(row.id)}
/>;
```

---

## 6. Form Components (`src/components/form/index.tsx`)

Use these with React Hook Form so value/onChange/error wiring is automatic.

### Available fields

- `TextInputField`
- `PasswordInputField`
- `SelectField`
- `NativeSelectField`
- `MultiSelectField`
- `TextareaField`
- `NumberInputField`
- `CheckboxField`
- `SwitchField`
- `RadioGroupField`
- `FileInputField`

### Base pattern

```tsx
type FormValues = {
  email: string;
  password: string;
  role: string;
};

const { control, handleSubmit } = useForm<FormValues>({
  resolver: zodResolver(schema),
  defaultValues: { email: "", password: "", role: "" },
});

<form onSubmit={handleSubmit(onSubmit)}>
  <TextInputField control={control} name="email" label="Email" />
  <PasswordInputField control={control} name="password" label="Password" />
  <SelectField
    control={control}
    name="role"
    label="Role"
    data={[
      { value: "admin", label: "Admin" },
      { value: "user", label: "User" },
    ]}
  />
  <AppButton type="submit">Submit</AppButton>
</form>;
```

### Best practices

- Keep validation in Zod schema when possible.
- Ensure `name` exactly matches form type keys.
- Set `defaultValues` to avoid uncontrolled warnings.

---

## Typical Page Composition

1. Wrap page with `PageCard`.
2. Place primary actions in `PageCard.action` using `AppButton`.
3. For lists, render `AppTable` in body.
4. For details, use `DetailCard` + `DetailGrid`.
5. For edit screens, use RHF field components + submit `AppButton`.
