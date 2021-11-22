import Overworld from "./components/GameContainer";

(function () {

    const overworld = new Overworld({
        element: document.querySelector(".game-container")
    });
    overworld.init();

})();