let env: string = 'prod';
if (process.env.TYC_ENV === 'production') {
  // @ts-ignore
  env = process.env.NODE_ENV === 'development' ? 'devProd' : 'prod';
} else if (process.env.TYC_ENV === 'pre') {
  env = 'pre';
} else if (process.env.TYC_ENV === 'test') {
  env = 'test';
}

export { env };
