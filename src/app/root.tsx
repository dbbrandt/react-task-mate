import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../../lib/apollo';

type RootLayoutProps = {
    children: React.ReactNode;
    pageProps: {
        initialApolloState?: any; // Adjust as needed
    };
};

export default function RootLayout({ children, pageProps }: RootLayoutProps) {
    const apolloClient = useApollo(pageProps.initialApolloState);
    return (
        <ApolloProvider client={apolloClient}>
            <div>
                HELLO
            </div>
        </ApolloProvider>
    );
}