interface CenteredPopupWindowProps {
    url: string;
    title: string;
    height: number;
    width: number;
}

export function openCenteredPopupWindow({ url, title, width, height }: CenteredPopupWindowProps): Window {
    /* Fixes dual-screen position                             Most browsers      Firefox */
    const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
    const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screenY;

    /* Get width and height of the current displace */
    const internalWidth = window.innerWidth
        ? window.innerWidth
        : document.documentElement.clientWidth
          ? document.documentElement.clientWidth
          : screen.width;
    const internalHeight = window.innerHeight
        ? window.innerHeight
        : document.documentElement.clientHeight
          ? document.documentElement.clientHeight
          : screen.height;

    /* Factor in position including zoom */
    const left = internalWidth / 2 - width / 2 + dualScreenLeft;
    const top = internalHeight / 2 - height / 2 + dualScreenTop;
    /* Open new window */

    const childWindow = window.open(
        url,
        title,
        `scrollbars=yes, width=${width}, height=${height}, top=${top}, left=${left}`
    );
    if (!childWindow) {
        throw new Error('Failed to open popup window');
    }

    childWindow.focus();

    return childWindow;
}
