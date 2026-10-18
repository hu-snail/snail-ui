# Table · Web

Simple table (n-table aligned). You author `thead/tbody/tr/th/td`; the
component provides the `<table>` root, merged border grid, header
background and stripes. For data-driven tables use [DataTable](./data-table).

## When to Use

- Present static sectional data;
- Full markup control over cells (merges, nesting).

## Basic

<Demo name="table-web-basic" description="Merged border grid + header background." />

## Bordered

<Demo name="table-web-bordered" description="Outer frame; bottom-bordered is ineffective while bordered." />

## Size

<Demo name="table-web-size" description="small / medium / large (padding 6/12/12px)." />

## Single Column

<Demo name="table-web-single-column" description="Row separators only." />

## Single Line

<Demo name="table-web-single-line" description="single-line defaults to true; false restores column separators." />

## Striped

<Demo name="table-web-striped" description="Zebra stripes on even tbody rows." />

## API

### SnTable Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| bordered | `boolean` | `true` | Outer frame border |
| bottom-bordered | `boolean` | `true` | Bottom border (ineffective while bordered) |
| single-column | `boolean` | `false` | No row separators |
| single-line | `boolean` | `true` | No column separators |
| size | `'small' \| 'medium' \| 'large'` | `'medium'` | Table scale |
| striped | `boolean` | `false` | Zebra stripes |

Events: none; Slots: `default` (consumer-authored thead/tbody).

See the component `ai-description.md` for the full contract.
