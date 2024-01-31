import { useEffect, useState,useRef,createRef } from "react";
import { Layer, Rect,Image as KonvaImage, Stage,Group } from "react-konva";
import useImage from 'use-image';
import Button from '@mui/material/Button';

const PIECE_SIZE = 80;

export default function Puzzle({ imageUrl }){
    const [image] = useImage(imageUrl);
    const [pieces, setPieces] = useState([]);
    const [puzzleSize, setPuzzleSize] = useState({ cols: 0, rows: 0 });
    const [windowSize,setWindowSize] = useState({w:window.innerWidth,h:puzzleSize.rows * PIECE_SIZE*1.3});
    const [refreshKey, setRefreshKey] = useState(0);
    const layerRef = useRef(null);
    const [nodeRefs,setNodeRefs] = useState([]);
    const [game,setGame] = useState(false);
    const [clear,setClear] = useState(false);

    const handleChange = ()=>{
        const shuffledPieces = [...pieces];
        for(let i = shuffledPieces.length - 1;i >= 0;i--){
            shuffledPieces[i].x = 10+shuffledPieces[i].order % 8 * PIECE_SIZE;
            shuffledPieces[i].y = 10+Math.floor(shuffledPieces[i].order / 8) * PIECE_SIZE;
            shuffledPieces[i].position = shuffledPieces[i].order;
        }
        for (let i = shuffledPieces.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledPieces[i].x, shuffledPieces[j].x] = [shuffledPieces[j].x, shuffledPieces[i].x];
            [shuffledPieces[i].y, shuffledPieces[j].y] = [shuffledPieces[j].y, shuffledPieces[i].y];
            [shuffledPieces[i].position, shuffledPieces[j].position] = [shuffledPieces[j].position, shuffledPieces[i].position];
        }
        setPieces(shuffledPieces);
        setGame(true);
    };

    useEffect(() =>{
        setWindowSize({w:window.innerWidth,h:puzzleSize.rows * PIECE_SIZE*1.3})
    },[window.innerWidth,puzzleSize]);

    useEffect(() => {
        ( () =>{
            if(image){
                setPuzzleSize({
                    cols: 8,
                    rows: Math.floor(8 * image.height /image.width),
                });
                setGame(false);
                setClear(false);
            }
        })();
    }, [image]);

    useEffect(() => {
        ( () => {
            if(image){
            const newPieces = [];
            for (let i = 0; i < puzzleSize.rows; i++) {
                for (let j = 0; j < puzzleSize.cols; j++) {
                    newPieces.push({
                    x: 10+j * PIECE_SIZE,
                    y: 10+i * PIECE_SIZE,
                    order: i * puzzleSize.cols + j,
                    position: i * puzzleSize.cols + j,
                    originX: 10+j * image.width / puzzleSize.cols,
                    originY: 10+i * image.height / puzzleSize.rows,
                    cropX: j * image.width / puzzleSize.cols,
                    cropY: i * image.height / puzzleSize.rows,
                    cropW: image.width / puzzleSize.cols,
                    cropH: image.height / puzzleSize.rows,
                    prevX: 10+j * PIECE_SIZE,
                    prevY: 10+i * PIECE_SIZE,
                    });
                }
            }
            setNodeRefs(newPieces.map(() => createRef()));
            setPieces(newPieces);
        }
        })();
    },[puzzleSize,image]);

    useEffect(() => {
        if (!game) return;
        const isComplete = pieces.every((piece, index) => piece.position === index);
        if (isComplete) {
            setClear(true);
            setGame(false);
        }
    },[pieces,game]);

    const handleDragEnd = (e,id) => {
        const stage = e.target.getStage();
        const newPosition = stage.getPointerPosition();
        let newPos ={};
        let newPieces = [...pieces];
        let prevPos ={x:newPieces[id].x,y:newPieces[id].y};
        if(puzzleSize.cols*PIECE_SIZE >= newPosition.x && puzzleSize.rows * PIECE_SIZE >= newPosition.y ){
            const pos = Math.floor(Math.max(0,(newPosition.y-10)) / 80) * 8 + Math.floor(Math.max(0,(newPosition.x-10)) / 80);
            if(pos != pieces[id].position){
                let i = 0;
                while(i < puzzleSize.cols * puzzleSize.rows && pos != pieces[i].position){
                    i++;
                }
                if(i == puzzleSize.cols * puzzleSize.rows){
                    newPos = { x: 10+Math.floor((newPosition.x-10) / 80)*80, y: 10+Math.floor((newPosition.y-10) / 80)*80};
                    newPieces[id].position = pos;
                } else {
                    if(pieces[id].position < puzzleSize.cols * puzzleSize.rows){
                        newPos = { x: 10+pieces[id].position % 8 * 80, y: 10+Math.floor(pieces[id].position / 8) * 80};
                    } else {
                        newPos = { x: pieces[id].x, y: pieces[id].y };
                        prevPos={ x: pieces[id].x, y: pieces[id].y };
                    }
                }
            } else {
                newPos = { x: 10+pieces[id].position % 8 * 80, y: 10+Math.floor(pieces[id].position / 8) * 80};
            }
        } else {
            newPieces[id].position = puzzleSize.cols * puzzleSize.rows;
            let newX = e.target.x();
            let newY = e.target.y();
            newPos = { x: newX, y: newY };
        }
        newPieces[id].prevX = prevPos.x;
        newPieces[id].prevY = prevPos.y;
        newPieces[id].x = newPos.x;
        newPieces[id].y = newPos.y;
        setPieces(newPieces);
        nodeRefs[id].current.position({ x: newPos.x, y: newPos.y });
    };

    return (
        <>
        <div style={{marginBottom:5}}>
            <Button variant="outlined" size="large" onClick={handleChange}>Shuffle</Button>
            {clear&&<div style={{textAlign:"center"}}>クリアおめでとう！！</div>}
        </div>
        <Stage width={window.innerWidth -30}
                height={puzzleSize.rows * PIECE_SIZE*1.3}>
            <Layer ref={layerRef}>
                <Rect
                    stroke='black'
                    strokeWidth={3}
                    x={0}
                    y={0}
                    width={window.innerWidth -30}
                    height={puzzleSize.rows * PIECE_SIZE * 1.3}
                />
                <Rect
                    stroke='black'
                    strokeWidth={3}
                    x={8}
                    y={8}
                    width={puzzleSize.cols * PIECE_SIZE + 4}
                    height={puzzleSize.rows * PIECE_SIZE + 4}
                />
                {pieces.map((piece, i) => (
                    <Group
                    ref={nodeRefs[i]}
                    key={i}
                    x={piece.x}
                    y={piece.y}
                    draggable
                    onDragMove={(e) => {
                        e.target.moveToTop();
                    }}
                    dragBoundFunc={(pos) => {
                        return{x: Math.min(Math.max(pos.x, -PIECE_SIZE*0.25), windowSize.w - PIECE_SIZE*1.15),
                            y: Math.min(Math.max(pos.y, -PIECE_SIZE*0.25), windowSize.h - PIECE_SIZE*0.75)};
                    }}
                    onDragEnd={(e) => {handleDragEnd(e, i);
                        setRefreshKey(refreshKey => refreshKey + 1);
                    }}
                    >
                    <KonvaImage
                        image={image}
                        width={PIECE_SIZE}
                        height={PIECE_SIZE}
                        crop={{
                        x: piece.cropX,
                        y: piece.cropY,
                        width: piece.cropW,
                        height: piece.cropH,
                        }}
                    />
                    <Rect
                        width={PIECE_SIZE}
                        height={PIECE_SIZE}
                        stroke="black"
                        strokeWidth={1}
                    />
                    </Group>
                ))}
            </Layer>
        </Stage>
        <div style={{textAlign:"center"}}>
            <p>
                正解
            </p>
            <img src={imageUrl} width={windowSize.w/3}/>
        </div>
        </>
    );
}
