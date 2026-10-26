# Log · Web

Fixed-height scrolling log viewer with reach / require-more events and a
built-in loading pill.

## Size

<Demo name="log-web-size" description="rows controls the viewer height." />

## Events

<Demo name="log-web-event" description="require-more / reach-top / reach-bottom." />

## Scroll control

<Demo name="log-web-scroll" description="scrollTo with and without silent." />

## Loading

<Demo name="log-web-loading" description="loading pill toggle." />

## Auto scroll to bottom

<Demo name="log-web-auto-bottom" description="Appending data keeps the view at the bottom." />

## API

### SnLog Props

| Prop          | Type       | Default     | Notes                                                 |
| ------------- | ---------- | ----------- | ----------------------------------------------------- |
| log           | `string`   | `undefined` | Log content, split on `\n`; wins over `lines`         |
| lines         | `string[]` | `[]`        | Log lines                                             |
| trim          | `boolean`  | `false`     | Trim each displayed line                              |
| loading       | `boolean`  | `false`     | Show the loading pill                                 |
| font-size     | `number`   | `14`        | Text size (px)                                        |
| line-height   | `number`   | `1.25`      | Unitless line-height                                  |
| rows          | `number`   | `15`        | Visible rows; height = rows × line-height × font-size |
| offset-top    | `number`   | `0`         | Top reach tolerance (px)                              |
| offset-bottom | `number`   | `0`         | Bottom reach tolerance (px)                           |

### Events

| Name         | Params              | Notes                              |
| ------------ | ------------------- | ---------------------------------- |
| reach-top    | —                   | Arrived at the top                 |
| reach-bottom | —                   | Arrived at the bottom              |
| require-more | `'top' \| 'bottom'` | Repeats while scrolling at an edge |

### Methods

| Name     | Type                                                                          | Notes                                           |
| -------- | ----------------------------------------------------------------------------- | ----------------------------------------------- |
| scrollTo | `(options: { top?: number, position?: 'top' \| 'bottom', silent?: boolean })` | Programmatic scroll; `silent` suppresses events |

See the component `ai-description.md` for the full contract.
