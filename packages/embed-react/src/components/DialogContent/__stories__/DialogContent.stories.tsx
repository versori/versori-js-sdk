import { Dialog } from '@radix-ui/themes';
import { Meta, type StoryObj } from '@storybook/react';
import { DialogContent } from '../DialogContent';

const meta = {
    title: 'DialogContent',
    component: DialogContent,
} satisfies Meta<typeof DialogContent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children: 'This is the content of the dialog',
        title: 'Dialog Title',
        description: 'Dialog description',
    },
    decorators: [
        (Story) => (
            <Dialog.Root open>
                <Story />
            </Dialog.Root>
        ),
    ],
};
