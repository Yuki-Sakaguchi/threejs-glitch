# Three.jsでグリッチのエフェクトを実装する

![result](https://user-images.githubusercontent.com/16290220/129472100-b8ac86cd-c147-41da-9cf4-6cecfa595450.gif)

# Part01（Three.js）

https://yuki-sakaguchi.github.io/threejs-glitch/part01/


# Part02（Nuxt.js + Three.js）

https://yuki-sakaguchi.github.io/threejs-glitch/part02/dist/

`nuxt.js` で動かすためには諸々の関連ファイルを `components` にまとめて使うページで読み込むくらいにできた。  
`vert` も `frag` もそれぞれファイルに分けて import するようにした  
必要なのは `raw-loader` なのでそれは別途インストールした

`nuxt.config.js` にこれを書いたらどこでも動くようになった（ローカルスト立ち上げれば）

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


# Part03（Next.js + Three.js）

https://yuki-sakaguchi.github.io/threejs-glitch/part03/out/



# 参考

- https://note.com/unshift/n/n0f707c95912e
- https://qiita.com/misaki_mofu/items/145ac26d600b429a6f8a
- https://ja.nuxtjs.org/docs/2.x/deployment/github-pages
- https://qiita.com/did0es/items/673735d7a241698e9114
- https://blog.narumium.net/2020/06/10/glsl%E3%83%95%E3%82%A1%E3%82%A4%E3%83%AB%E3%82%92import%E3%81%99%E3%82%8B/
- https://blog.5ebec.dev/posts/webpack-ts-three-js-glsl/
- https://nextjs-ja-translation-docs.vercel.app/docs/advanced-features/module-path-aliases