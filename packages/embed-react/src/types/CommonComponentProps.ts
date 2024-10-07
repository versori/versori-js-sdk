export type CommonComponentProps = {
    /**
     * ID is an optional DOM attribute which is propagated to the root element rendered by this component
     */
    id?: string;

    /**
     * className is an optional DOM attribute which is propagated to the root element rendered by this component
     */
    className?: string;
};

type ExtractedCommonProps<T extends CommonComponentProps> = Omit<T, keyof CommonComponentProps> & {
    commonProps: CommonComponentProps;
};

export function extractCommonProps<T extends CommonComponentProps>(props: T): ExtractedCommonProps<T> {
    const { id, className, ...rest } = props;

    return {
        commonProps: {
            id,
            className,
        },
        ...rest,
    };
}
