export const Wallet = {
    ALGOSIGNER: 'AlgoSigner',
    MY_ALGO_WALLET: 'My Algo'
};

export const Color = {
    DARK_YELLOW: '#d2c500',
    RED: '#890f0d',
    YELLOW: '#fff323'
};

export const ButtonTypes = {
    WITHDRAW: 'Withdraw',
    DEPOSIT: 'Deposit'
};

// contract constants
export const TEN_BILLION = 10000000000000000n;
export const ACCOUNT_MIN_BALANCE = 1000000;

export const Routes = {
    HOME: '/',
    ADMIN: '/admin',
    LOTTERY: '/admin/lottery',
    PRIVACY: '/privacy',
    TERMS: '/toc',
    ABOUT: '/about'
};

export const ImageSrc = {
    LOGO: 'https://cdn.discordapp.com/attachments/953368390834217002/970019718050238524/opt-logo-sharp.png',
    LOGO_WITH_TITLE:
        'https://cdn.discordapp.com/attachments/868878082893824030/953660971249979422/opt-logo-sharp.png',
    IMAGE1: 'https://cdn.discordapp.com/attachments/868878082893824030/952078399239774229/image_1.png',
    IMAGE2: 'https://cdn.discordapp.com/attachments/868878082893824030/952078399487217664/image_2.png',
    IMAGE3: 'https://cdn.discordapp.com/attachments/868878082893824030/952078399843758100/image_3.png',
    ALGOS: 'https://cdn.discordapp.com/attachments/953368390834217002/978233013068529664/algo-removebg-preview.png'
};

export const GlobalStateKeys = {
    PAUSED: 'paused',
    GOVERNANCE_NONCE: 'gov_nonce',
    PERIOD_START: 'period_start',
    REWARD_DISTRIBUTION: 'reward_distribution',
    REGISTRATION_END: 'registration_end',
    PERIOD_END: 'period_end',
    CUSTODIAL_DEPOSIT: 'cust_dep',
    REWARD_RATE: 'reward_rate_no',
    REWARD_DECIMAL: 'reward_rate_decimals',
    GLOBAL_TOTAL_OPT_DISPERSED_AT_GOVERNANCE:
        'total_opt_dispersed_at_governance',
    GLOBAL_APP_BALANCE_AT_GOVERNANCE: 'app_balance_at_governance',
    LAST_LOTTERY_DISPENSE_TS: 'lst_lott_dispersal_ts'
};

export const LocalStateKeys = {
    WHITELISTED: 'whitelisted',
    DEPOSITED: 'deposited',
    REGISTERED: 'registered',
    VOTED: 'voted'
};

export const AppActions = {
    WHITELIST_ACCOUNTS: 'whitelist_acc',
    REGISTER_CUSTODIAL_WALLETS: 'str:register_custodial_wallets',
    VOTE: 'str:vote_by_custodial_wallets',
    WITHDRAW_REWARDS: 'str:custodial_withdraw_rewards',
    EXCHANGE: 'str:exchange',
    CUSTODIAL_WITHDRAW: 'str:custodial_withdraw',
    CUSTODIAL_DEPOSIT: 'str:custodial_deposit',
    GOV_TIMELINES: 'str:set_governance_timelines',
    PAUSE_APP: 'str:pause_app',
    UNPAUSE_APP: 'str:unpause_app',
    CLOSE_CUSTODIAL_WALLETS: 'str:custodial_close_wallets',
    SET_GOV_REWARD_RATE: 'str:set_governance_reward_rate',
    DISPENSE_LOTTERY: 'str:disperse_lottery'
};

export const NetworkArray = ['MainNet', 'TestNet', 'BetaNet', 'private-net'];

export const AlgoExplorerAlgodURL = {
    MAIN_NET_URL: 'https://node.algoexplorerapi.io',
    TEST_NET_URL: 'https://node.testnet.algoexplorerapi.io',
    BETA_NET_URL: 'https://node.betanet.algoexplorerapi.io'
};

export const AlgoExplorerIndexerURL = {
    MAIN_NET_URL: 'https://algoindexer.algoexplorerapi.io',
    TEST_NET_URL: 'https://algoindexer.testnet.algoexplorerapi.io',
    BETA_NET_URL: 'https://algoindexer.betanet.algoexplorerapi.io'
};

export const PurestakeAlgodURL = {
    MAIN_NET_URL: 'https://mainnet-algorand.api.purestake.io/ps2',
    TEST_NET_URL: 'https://testnet-algorand.api.purestake.io/ps2',
    BETA_NET_URL: 'https://betanet-algorand.api.purestake.io/ps2'
};

export const PurestakeIndexerURL = {
    MAIN_NET_URL: 'https://mainnet-algorand.api.purestake.io/idx2',
    TEST_NET_URL: 'https://testnet-algorand.api.purestake.io/idx2',
    BETA_NET_URL: 'https://betanet-algorand.api.purestake.io/idx2'
};

export const AlgoNodeAlgodURL = {
    MAIN_NET_URL: 'https://mainnet-api.algonode.cloud',
    TEST_NET_URL: 'https://testnet-api.algonode.cloud',
};

export const AlgoNodeIndexerURL = {
    MAIN_NET_URL: 'https://mainnet-idx.algonode.cloud',
    TEST_NET_URL: 'https://testnet-idx.algonode.cloud',
};

export const LOCAL_HOST = 'http://localhost';

export const GovernanceAddr = 'Governance Address';

export const TIMEOUT = 500; // for success and error messages

export const LocalStorageKeys = {
    DISPENSE_LOTTERY_TIMES: 'Dispense Times',
    GOV_PERIOD: 'Governance Period'
};

export const CurrentNetwork = NetworkArray[0]; // testnet
