// https://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: 'babel-eslint',
        sourceType: 'module'
    },
    env: {
        browser: true,
    },
    extends: [
        'plugin:vue/strongly-recommended',
        'eslint:recommended'
    ],
    // required to lint *.vue files
    plugins: [
        'vue'
    ],
    globals: {
        __dirname: true,
        module: true,
        process: true,
        require: true,
        $: true,
        Vue: true,
        Z: true
    },
    // add your custom rules here
    'rules': {
        "indent": ["error", 4], // 所有为2个空格
        "semi": 2, // 语句分号结尾
        'prefer-promise-reject-errors': 0, // promise的reject不需要一定返回error
        'camelcase': 0, // 这个待定
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        'no-prototype-builtins': 0, // 会需要调用prototype的方法
        "vue/html-indent": ["error", 4, { // vue的html中4个空格缩进
            "attribute": 1,
            "baseIndent": 1,
            "closeBracket": 0,
            "alignAttributesVertically": true,
            "ignores": []
        }],
        "vue/script-indent": ["error", 4, { // vue的js中4个空格缩进
            "baseIndent": 0,
            "switchCase": 0,
            "ignores": []
        }],
        'vue/require-valid-default-prop': 0, // 检查默认值和类型是否对应正确
        'vue/custom-event-name-casing': 0, // 强制自定义事件名称始终使用“ kebab-case”
        'vue/no-mutating-props': 0, // 不允许修改属性值
        'vue/require-prop-types': 0, // 强制指定属性变量类型
        'vue/one-component-per-file': 0, // 强制指定属性变量类型
        'vue/require-default-prop': 0, // 强制指定属性变量值
        'vue/comment-directive': 0, // 支持eslint-disable注释
        "vue/html-self-closing": ["error", {
            "html": {
                "void": "any",
                "normal": "any",
                "component": "always"
            },
        }],
        'vue/no-side-effects-in-computed-properties': 0, // 允许在computed中改变data的属性
        'vue/attribute-hyphenation': 0 // 允许组件传参使用驼峰命名
    },
    overrides: [
        {
            files: ["*.vue"],
            rules: {
                indent: "off"
            }
        }
    ]
};
