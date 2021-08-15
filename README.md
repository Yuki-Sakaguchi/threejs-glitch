# Three.jsでグリッチのエフェクトを実装する



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

https://yuki-sakaguchi.github.io/threejs-glitch/part03/



# 参考

- https://note.com/unshift/n/n0f707c95912e
- https://qiita.com/misaki_mofu/items/145ac26d600b429a6f8a
- https://ja.nuxtjs.org/docs/2.x/deployment/github-pages
