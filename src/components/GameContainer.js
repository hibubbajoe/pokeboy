import { useEffect } from 'react';
import buildOverWorld from '../components/BuildWorld'

function OverWorld() {

    useEffect(() => {
        buildOverWorld();
    }, [])

    return (
        <div class="game-container" >
            <canvas class="game-canvas" width="352" height="198"></canvas>
        </div>
    )
}

export default OverWorld;