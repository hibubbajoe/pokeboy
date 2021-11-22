import { withGrid } from "../utils/utils";

export default class Sprite {
    constructor(config) {

        //Set up the image
        this.image = new Image();
        this.image.src = config.src;
        this.image.onload = () => {
            this.isLoaded = true;
        }

        //Shadow
        this.shadow = new Image();
        this.useShadow = true; //config.useShadow || false
        if (this.useShadow) {
            this.shadow.src = "/images/characters/shadow.png";
        }
        this.shadow.onload = () => {
            this.isShadowLoaded = true;
        }

        //Configure Animations and inital states
        this.animations = config.animations || {
            "idle-down": [[0, 0]],
            "idle-right": [[0, 1]],
            "idle-up": [[0, 2]],
            "idle-left": [[0, 3]],
            "walk-down": [[1, 0], [0, 0], [3, 0], [0, 0],],
            "walk-right": [[1, 1], [0, 1], [3, 1], [0, 1],],
            "walk-up": [[1, 2], [0, 2], [3, 2], [0, 2],],
            "walk-left": [[1, 3], [0, 3], [3, 3], [0, 3],]
        }

        // Set starting frame to chosen value
        this.currentAnimation = config.currentAnimation || 'idle-down';
        this.currentAnimationFrame = 0;

        // Set sprite animation to happen on every chosen frame limit
        this.animationFrameLimit = config.animationFrameLimit || 8;
        this.animationFrameProgress = this.animationFrameLimit;

        //Reference the game object
        this.gameObject = config.gameObject;
    }

    // Picks out sprite coordinates by getting the first/only index with chosen key
    get frame() {
        return this.animations[this.currentAnimation][this.currentAnimationFrame]
    }

    // Försök förstå den här
    setAnimation(key) {
        if (this.currentAnimation !== key) {
            this.currentAnimation = key;
            this.currentAnimationFrame = 0;
            this.animationFrameProgress = this.animationFrameLimit;
        }
    }

    // Försök förstå den här
    updateAnimationProgress() {

        // If frame progress is greater than 0 we tick down 
        if (this.animationFrameProgress > 0) {
            this.animationFrameProgress -= 1;
            return;
        }

        // Reseting the counter when frame progress reaches 0 
        this.animationFrameProgress = this.animationFrameLimit;
        this.currentAnimationFrame += 1;

        // If no more sprite coordinates we reset the animation
        if (this.frame === undefined) {
            this.currentAnimationFrame = 0;
        }
    }

    draw(ctx, cameraPerson) {
        const x = this.gameObject.x - 8 + withGrid(10.5) - cameraPerson.x;
        const y = this.gameObject.y - 18 + withGrid(6) - cameraPerson.y;

        // Draws shadow under our sprites
        this.isShadowLoaded && ctx.drawImage(this.shadow, x, y);

        // Destructuring coordinates from frame getter
        const [frameX, frameY] = this.frame;

        // Draws our hero and npc sprites
        this.isLoaded && ctx.drawImage(this.image,
            frameX * 32, frameY * 32,   // Picks out sprite from sprite sheet
            32, 32, // Size of 1 sprite object
            x, y,   // Placement on grid
            32, 32  // Size of chosen sprite object
        )

        this.updateAnimationProgress();
    }
}