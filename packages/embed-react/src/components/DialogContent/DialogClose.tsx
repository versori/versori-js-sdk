import { Dialog, IconButton } from '@radix-ui/themes';
import CloseIcon from '../../assets/close-icon.svg';
import './DialogClose.scss';

export function DialogClose() {
    return (
        <Dialog.Close>
            <IconButton type="button" variant="ghost" className="vi-DialogClose">
                <CloseIcon />
            </IconButton>
        </Dialog.Close>
    );
}
