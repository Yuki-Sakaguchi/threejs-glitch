# Three.jsでグリッチのエフェクトを実装する

![result](https://user-images.githubusercontent.com/16290220/129472100-b8ac86cd-c147-41da-9cf4-6cecfa595450.gif)

## Part01（Three.js）

https://yuki-sakaguchi.github.io/threejs-glitch/part01/


## Part02（Nuxt.js + Three.js）

https://yuki-sakaguchi.github.io/threejs-glitch/part02/dist/


## Part03（Next.js + Three.js + TypeScript）

https://yuki-sakaguchi.github.io/threejs-glitch/part03/out/


## Part04（Three.js + mousemoveでグリッチを実行）

https://yuki-sakaguchi.github.io/threejs-glitch/part04/

## 参考

- https://note.com/unshift/n/n0f707c95912e
- https://qiita.com/misaki_mofu/items/145ac26d600b429a6f8a
- https://ja.nuxtjs.org/docs/2.x/deployment/github-pages
- https://qiita.com/did0es/items/673735d7a241698e9114
- https://blog.narumium.net/2020/06/10/glsl%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E3%82%92import%E3%81%99%E3%82%8B/
- https://blog.5ebec.dev/posts/webpack-ts-three-js-glsl/
- https://nextjs-ja-translation-docs.vercel.app/docs/advanced-features/module-path-aliases

## おまけ）Nuxt.jsとNext.jsで静的ビルトしたファイルをGitHub Pagesにあげる方法

どちらもまあまあ苦労した...  
「置けば動く」の状態には持っていけなかった. 

GitHub Actions を使えばいけそうだけどちょっと面倒だったので試してない. 

## 共通

どちらも生成されるファイルにアンダースコアが含まれているが GitHub Pages はアンスコ始まるのファイルやディレクトリを無視するらしいのでそれを無効にする必要がある。  
ドキュメントルートに `.nojekyll` という名前のファイルをおけばOK

### Nuxt.js

`nuxt.config.js` に追加する設定はこちら  
これと.nojekyllファイルがあれば `npm run generate` でビルドされた静的ファイルがそのまま動くようになる  
デフォルトでは `dist` ディレクトリは `.gitignore` で除外しているのでそれもコメントアウトしておく

```js
router: {
  base: '.',
  extendRoutes (routes, resolve) {
    routes.push({
      name: 'custom',
      path: '*',
      component: resolve(__dirname, 'pages/index.vue')
    })
  }
}
```

### Next.js

`next.config.js` に追加する設定はこちら（色々調べてこれでいけたけどもっとベストがありそう...でも疲れたので諦めた）  
デフォルトだと静的ビルトコマンドがないので `"export": "next build && next export"` こんな感じのコマンドを追加して叩く  
Nuxt.jsと同じように `out` ディレクトリは無視されているのでそれは解除しておく

```js
const isProd = process.env.NODE_ENV == 'production';

module.exports = {
  basePath: isProd ? '/threejs-glitch/part03/out' : '',
  assetPrefix: isProd ? 'https://yuki-sakaguchi.github.io/threejs-glitch/part03/out' : '',
```
