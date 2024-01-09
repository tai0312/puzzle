import { useEffect, useState,useRef } from "react";
import { Layer, Rect,Image as KonvaImage, Stage,Group } from "react-konva";
import useImage from 'use-image';

const PIECE_SIZE = 80;

export default function Puzzle({ imageUrl }){
    const [image] = useImage(imageUrl);
    const [pieces, setPieces] = useState([]);
    const [movePiece,setMovePiece] = useState();
    const [puzzleSize, setPuzzleSize] = useState({ cols: 0, rows: 0 });
    const layerRef = useRef(null);

    useEffect(() => {
        ( () =>{
            if(image){
                setMovePiece(8*Math.floor(8 * image.height /image.width));
                setPuzzleSize({
                    cols: 8,
                    rows: Math.floor(8 * image.height /image.width),
                });
                //setPieces(newPieces.sort(() => Math.random() - 0.5));               
                console.log(image.width,image.height);
            }
        })();
    }, [image]);

    useEffect(() => {
        ( () => {
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
            setPieces(newPieces);
            console.log(puzzleSize);
            console.log(newPieces);
        })();
    },[puzzleSize,image]);

    const handleDragMove = (e,i) => {
        const stage = e.target.getStage();
        const mousePos = stage.getPointerPosition();
        console.log("mouse"+mousePos.x,mousePos.y);
        console.log("piece"+e.target.x(),e.target.y());
        let newX = mousePos.x - PIECE_SIZE/2;
        let newY = mousePos.y - PIECE_SIZE/2;
        if (newX < -PIECE_SIZE / 2){
            newX = -PIECE_SIZE / 4;
        }
        if (newY < -PIECE_SIZE / 2){
            newY = -PIECE_SIZE / 4;
        }
        if (newX > stage.width() - PIECE_SIZE / 2){
            newX = stage.width() - PIECE_SIZE / 4*3;
        }
        if (newY > stage.height() - PIECE_SIZE / 2){
            newY = stage.height() - PIECE_SIZE / 4*3;
        }
        const newPieces = pieces.map((piece, index) => {
            if (index === i) {
                return { 
                    x: newX,
                    y: newY,
                    order: piece.order,
                    position: piece.position,
                    originX: piece.originX,
                    originY: piece.originY,
                    cropX: piece.cropX,
                    cropY: piece.cropY,
                    cropW: piece.cropW,
                    cropH: piece.cropH,
                    prevX: piece.prevX,
                    prevY: piece.prevY,
                };
            } else {
                return piece;
            }
        });
    
        setPieces(newPieces);
    }

    const handleMouseUp = (e,id) => {
        const stage = e.target.getStage();
        const newPosition = stage.getPointerPosition();
        let newPos ={};
        let newPieces = pieces;
        if(0 <= newPosition.x && puzzleSize.cols*PIECE_SIZE >= newPosition.x && 0 <= newPosition.y && puzzleSize.rows * PIECE_SIZE >= newPosition.y ){
            const pos = Math.floor(newPosition.y / 80) * 8 + Math.floor(newPosition.x / 80);
            if(pos != pieces[id].position){
                let i = 0;
                while(i < puzzleSize.cols * puzzleSize.rows && pos != pieces[id].position){
                    i++;
                }
                if(i == puzzleSize.cols * puzzleSize.rows){
                    //setPosition({ x: 10+Math.floor(newPosition.x / 80)*80, y: 10+Math.floor(newPosition.y / 80)*80});
                    pieces[id].x = 10+Math.floor(newPosition.x / 80)*80;
                    pieces[id].y = 10+Math.floor(newPosition.y / 80)*80;
                    newPos = { x: 10+Math.floor(newPosition.x / 80)*80, y: 10+Math.floor(newPosition.y / 80)*80};
                    pieces[id].position = pos;
                } else {
                    if(piece.position < puzzleSize.cols * puzzleSize.rows){
                        //setPosition({ x: 10+piece.position % 8 * 80, y: 10+Math.floor(piece.position / 8) * 80});
                        pieces[id].x = 10+pieces[id].position % 8 * 80;
                        pieces[id].y = 10+Math.floor(pieces[id].position / 8) * 80;
                        newPos = { x: 10+pieces[id].position % 8 * 80, y: 10+Math.floor(pieces[id].position / 8) * 80};
                    } else {
                        //setPosition({ x: piece.prevX, y: piece.prevY });
                        pieces[id].x = pieces[id].prevX;
                        pieces[id].y = pieces[id].prevY;
                        newPos = { x: pieces[id].prevX, y: pieces[id].prevY };
                    }
                }
            } else {
                //setPosition({ x: 10+piece.position % 8 * 80, y: 10+Math.floor(piece.position / 8) * 80});
                pieces[id].x = 10+pieces[id].position % 8 * 80;
                pieces[id].y = 10+Math.floor(pieces[id].position / 8) * 80;
                newPos = { x: 10+pieces[id].position % 8 * 80, y: 10+Math.floor(pieces[id].position / 8) * 80};
            }
        } else {
            pieces[id].position = puzzleSize.cols * puzzleSize.rows;
            let newX = newPosition.x- PIECE_SIZE/2;
            let newY = newPosition.y- PIECE_SIZE/2;
            if (newX < -PIECE_SIZE / 2){
                newX = -PIECE_SIZE / 4;
            }
            if (newY < -PIECE_SIZE / 2){
                newY = -PIECE_SIZE / 4;
            }
            if (newX > stage.width() - PIECE_SIZE / 2){
                newX = stage.width() - PIECE_SIZE / 4*3;
            }
            if (newY > stage.height() - PIECE_SIZE / 2){
                newY = stage.height() - PIECE_SIZE / 4*3;
            }
            //setPosition({ x: newX, y: newY });
            pieces[id].x = newX;
            pieces[id].y = newY;
            newPos = { x: newX, y: newY };
        }
        newPieces[id].prevX = newPos.x;
        newPieces[id].prevY = newPos.y;
        setPieces(newPieces);
    };

    return (
        <Stage width={puzzleSize.cols * PIECE_SIZE*2} height={puzzleSize.rows * PIECE_SIZE*1.5}>
            <Layer ref={layerRef}>
                <Rect
                    stroke='black'
                    strokeWidth={3}
                    x={0}
                    y={0}
                    width={puzzleSize.cols * PIECE_SIZE * 2}
                    height={puzzleSize.rows * PIECE_SIZE * 1.5}
                />
                <Rect
                    stroke='black'
                    strokeWidth={3}
                    x={7}
                    y={7}
                    width={puzzleSize.cols * PIECE_SIZE + 5}
                    height={puzzleSize.rows * PIECE_SIZE + 5}
                />
                {pieces.map((piece, i) => (
                    <Group
                    key={i}
                    x={piece.x}
                    y={piece.y}
                    draggable
                    onDragMove={(e) => {
                        e.target.moveToTop();
                        handleDragMove(e, i);
                    }}
                    onMouseUp={(e) => handleMouseUp(e, i)}
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
    );
}
//ピースをはめる処理がうまくいっていない、ピースを離し、違うピースを動かした瞬間にはまる処理がされている感じ、下にピースがあってもはまってしまう