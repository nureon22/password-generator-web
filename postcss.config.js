import autoprefixer from "autoprefixer";
import inputRange from "postcss-input-range";

export default {
    plugins: [
        inputRange(),
        autoprefixer(),
    ]
}