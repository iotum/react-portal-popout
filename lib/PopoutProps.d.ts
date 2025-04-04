import WindowFeaturesOptions from './WindowFeaturesOptions';
export default interface PopoutProps {
    hidden?: boolean;
    name?: string;
    title?: string;
    onClose?: () => void;
    onBeforeUnload?: (evt: BeforeUnloadEvent) => string | null | undefined;
    onBlocked?: () => void;
    children?: any;
    options?: Partial<WindowFeaturesOptions>;
    html?: string;
    url?: string;
    fullscreen?: boolean;
    className?: string;
    style?: CSSRuleList;
}
