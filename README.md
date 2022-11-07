## vue-multilingual-generator

### usage

```shell
git pull https://github.com/Rynxiao/vue-mutlilingual-generator.git

cd vue-mutlilingual-generator
npm install

npm run build
```

Html files will generate in the `dist` folder

### Configuration

#### useOnePage

Default value is `false`

Should generate html with `language` folders, for example, `en/es/pt`

if set `false`, will generate html file with different folder and in each html, you can get the language with variable

```javascript
window.lang
```

if set `true`, will only generate one html file. You can get the language by location search

```javascript
window.location.serach
```

#### languages

The html files will be generated with provided languages

#### forceUpdate

By default, if html file has been generated before, then will not generate the existed html files again.

By editing the forceUpdate to force some pages to generate again.

```javascript
forceUpdate: ['page1', 'page2']
```