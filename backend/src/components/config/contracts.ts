export const CONTRACTS = {
  VESU: {
    SEPOLIA: {
      SINGLETON:
        "0x01ecab07456147a8de92b9273dd6789893401e8462a737431493980d9be6827",
      EXTENSION_PO:
        "0x0571efca8cae0e426cb7052dad04badded0855b4cd6c6f475639af3356bc33fe",
      EXTENSION_CL:
        "0x05005006d674f502ec74b498b07efca725aeb33da17861fb6a340485092f3fe6",
      ORACLE:
        "0x014af20afa8046eb473c5acf952b19755e5831654c2419538e2d1055b096665a",
      SUMMARY_STATS:
        "0x0379afb83d2f8e38ab08252750233665a812a24278aacdde52475618edbf879c",
      WBTC_VAULT:
        "0x00abbd6f1e590eb83addd87ba5ac27960d859b1f17d11a3c1cd6a0006704b141",
    },
  },
} as const;

// Mock data for development
export const MOCK_DATA = {
  VESU: {
    LENDING: {
      APY: 0.08, // 8% APY
      TVL: 30000000, // $30M TVL
      UTILIZATION_RATE: 0.75, // 75% utilization
    },
  },
} as const;
