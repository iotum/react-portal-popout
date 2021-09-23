import * as React from 'react';
import './childWindowMonitor';
import PopoutProps from './PopoutProps';
export default class Popout extends React.Component<PopoutProps> {
    styleElement?: HTMLStyleElement | null;
    child?: Window | null;
    private id?;
    private container?;
    private setupAttempts;
    componentDidUpdate(): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element | null;
    private setupOnCloseHandler;
    private setupCleanupCallbacks;
    private setupStyleElement;
    private injectHtml;
    private setupStyleObserver;
    private initializeChildWindow;
    private openChildWindow;
    private closeChildWindowIfOpened;
    private renderChildWindow;
}
