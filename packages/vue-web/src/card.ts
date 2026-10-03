import {
  computed,
  defineComponent,
  h,
  type PropType,
} from 'vue';
import {
  CardTokens,
  type CardPadding,
  type CardProps,
  type CardVariant,
} from '@snui/protocol';

/**
 * AUI Vue 3 Card — container for grouped content.
 *
 * Per AGENTS.md §32, this component handles Rendering / Interaction / DOM /
 * Platform Integration only. Schema validation happens upstream via
 * CardPropsSchema; binding/action resolution lives in the runtime layer.
 *
 * Phase 2 simplification: `title` + `description` props render a default
 * header at the start of the body. Authors needing full layout control can
 * use UINode children instead of `title`/`description` — the renderer treats
 * `children` as the default body.
 *
 * Why no separate CardHeader / CardBody / CardFooter components?
 *   - Keeps the schema-driven path minimal (single `card` type)
 *   - Authors that want full layout use children freely
 *   - Adds no new ComponentContract surface
 *   - Follows AGENTS.md §11 (Minimal Change)
 */

let cardHeaderSeq = 0;
const nextTitleId = () => `snui-card-title-${++cardHeaderSeq}`;
const nextDescId = () => `snui-card-desc-${cardHeaderSeq}`;

export const Card = defineComponent({
  name: 'SnuiCard',

  props: {
    title: { type: String, default: undefined },
    description: { type: String, default: undefined },
    variant: {
      type: String as PropType<CardVariant>,
      default: 'default',
    },
    padding: {
      type: String as PropType<CardPadding>,
      default: 'md',
    },
    bordered: { type: Boolean, default: true },
    shadow: { type: Boolean, default: false },
  },

  setup(props, { slots, attrs }) {
    const titleId = computed(() => (props.title ? nextTitleId() : undefined));
    const descriptionId = computed(() =>
      props.description ? nextDescId() : undefined,
    );

    const classList = computed<string[]>(() => {
      const list: string[] = ['snui-card', `snui-card--${props.variant}`];
      if (props.bordered) list.push('snui-card--bordered');
      if (props.shadow) list.push('snui-card--elevated');
      return list;
    });

    const styleMap = computed<Record<string, string>>(() => ({
      background: CardTokens.background,
      borderColor: CardTokens.borderColor,
      borderRadius: CardTokens.radius,
      boxShadow: props.shadow ? CardTokens.shadow : 'none',
      padding: CardTokens.padding[props.padding],
    }));

    return () => {
      const headerNode =
        props.title || props.description
          ? h('header', { class: 'snui-card__header' }, [
              props.title
                ? h(
                    'h3',
                    {
                      class: 'snui-card__title',
                      id: titleId.value,
                    },
                    props.title,
                  )
                : null,
              props.description
                ? h(
                    'p',
                    {
                      class: 'snui-card__description',
                      id: descriptionId.value,
                    },
                    props.description,
                  )
                : null,
            ])
          : null;

      const slotNodes = slots.default?.() ?? [];
      const bodyNode = h(
        'div',
        { class: 'snui-card__body' },
        slotNodes,
      );

      const footerSlot = slots.footer?.();
      const footerNode =
        footerSlot && footerSlot.length > 0
          ? h('footer', { class: 'snui-card__footer' }, footerSlot)
          : null;

      return h(
        'section',
        {
          class: classList.value,
          style: styleMap.value,
          role: 'region',
          'aria-labelledby': titleId.value,
          'aria-describedby': descriptionId.value,
          ...attrs,
        },
        [headerNode, bodyNode, footerNode].filter(Boolean) as ReturnType<typeof h>[],
      );
    };
  },
});

export type { CardProps };