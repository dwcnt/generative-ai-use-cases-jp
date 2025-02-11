import * as cdk from 'aws-cdk-lib';
import { StackInput, stackInputSchema } from './lib/stack-input';

// CDK Context からパラメータを取得する場合
const getContext = (app: cdk.App): StackInput => {
  const params = stackInputSchema.parse(app.node.getAllContext());
  return params;
};

// パラメータを直接定義する場合
const envs: Record<string, Partial<StackInput>> = {
  // 必要に応じて以下をカスタマイズ
  // paramter.ts で無名環境を定義したい場合は以下をアンコメントすると cdk.json の内容が無視され、parameter.ts がより優先されます。
  // '': {
  //   // 無名環境のパラメータ
  //   // デフォルト設定を上書きしたいものは以下に追記
  // },
  dev: {
    // 開発環境のパラメータ
    ragKnowledgeBaseEnabled: true,
    ragKnowledgeBaseStandbyReplicas: false,
    ragKnowledgeBaseAdvancedParsing: true,
    ragKnowledgeBaseAdvancedParsingModelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
    embeddingModelId: 'amazon.titan-embed-text-v2:0',
    agentEnabled: true,
    modelRegion: 'us-east-1',
    modelIds: [
      "anthropic.claude-3-5-sonnet-20241022-v2:0",
      "anthropic.claude-3-5-sonnet-20240620-v1:0",
      "anthropic.claude-3-sonnet-20240229-v1:0",
      "anthropic.claude-3-haiku-20240307-v1:0",
      "amazon.nova-pro-v1:0",
      "amazon.nova-lite-v1:0",
      "amazon.nova-micro-v1:0",
      "amazon.titan-text-premier-v1:0",
      "meta.llama3-70b-instruct-v1:0",
      "meta.llama3-8b-instruct-v1:0",
      "cohere.command-r-plus-v1:0",
      "cohere.command-r-v1:0",
      "mistral.mistral-large-2402-v1:0"
    ],
    imageGenerationModelIds: [
      "amazon.nova-canvas-v1:0",
      "amazon.titan-image-generator-v2:0",
      "amazon.titan-image-generator-v1",
      "stability.stable-diffusion-xl-v1"
    ],
  },
  staging: {
    // ステージング環境のパラメータ
  },
  prod: {
    // 本番環境のパラメータ
  },
  // 他環境も必要に応じてカスタマイズ
};

// 後方互換性のため、CDK Context > parameter.ts の順でパラメータを取得する
export const getParams = (app: cdk.App): StackInput => {
  // デフォルトでは CDK Context からパラメータを取得する
  let params = getContext(app);

  // env が envs で定義したものにマッチ場合は、envs のパラメータを context よりも優先して使用する
  if (envs[params.env]) {
    params = stackInputSchema.parse({
      ...envs[params.env],
      env: params.env,
    });
  }

  return params;
};
