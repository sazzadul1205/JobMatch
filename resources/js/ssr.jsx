/* prettier-ignore */
import {
createInertiaApp
} from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import ReactDOMServer from 'react-dom/server';

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        resolve: (name) => {
            const pages = import.meta.glob('./pages/**/*.{tsx,jsx}', {
                eager: true,
            });
            const tsxPath = `./pages/${name}.tsx`;
            const jsxPath = `./pages/${name}.jsx`;
            const pageModule = pages[tsxPath] ?? pages[jsxPath];

            if (!pageModule) {
                throw new Error(`Page not found: ${tsxPath} or ${jsxPath}`);
            }

            return pageModule;
        },
        // prettier-ignore
        setup: ({ App, props }) => <App {...props} />,
    }),
);
