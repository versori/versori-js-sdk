import { Theme } from '@radix-ui/themes';
import type { Preview } from '@storybook/react';
import '@radix-ui/themes/styles.css';
import './styles.scss';

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
    decorators: [
        (Story) => (
            <Theme>
                <Story />
            </Theme>
        ),
    ],
};

export default preview;
