import Overworld from "./Overworld";

const buildOverWorld = () => {
    const overworld = new Overworld({
        element: document.querySelector(".game-container")
    });

    overworld.init()
}

export default buildOverWorld;