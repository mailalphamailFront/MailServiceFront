/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_TEST_ACCOUNT_EMAIL: string;
    readonly VITE_TEST_ACCOUNT_PASSWORD: string;
    readonly VITE_TEST_PROVIDER: string;
    readonly VITE_TEST_USER_LOGIN_PASSWORD: string;
    readonly VITE_TEST_GMAIL_PASSWORD: string;
    readonly VITE_TEST_NAVER_PASSWORD: string;
    readonly VITE_TEST_DAUM_PASSWORD: string;
    readonly VITE_TEST_YAHOO_PASSWORD: string;
    readonly VITE_TEST_OUTLOOK_PASSWORD: string;
    readonly VITE_TEST_ICLOUD_PASSWORD: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
