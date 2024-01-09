import { useEffect, useState,useRef } from "react";
import { Layer, Rect,Image, Stage,Group } from "react-konva";
import useImage from 'use-image';
import PuzzlePiece from "./PuzzlePiece";

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

    /*const mouseMove = (e) => {
        const stage = e.target.getStage();
        const mousePoint = stage.getPointerPosition();
        console.log(mousePoint.x,mousePoint.y);
        let i = 0;
        while(i < puzzleSize.cols * puzzleSize.rows && !(pieces[i].prevX <= mousePoint.x && pieces[i].prevX+PIECE_SIZE >= mousePoint.x && pieces[i].prevY <= mousePoint.y && pieces[i].prevY+PIECE_SIZE >= mousePoint.y)){
            i++;
        }
        if(i != puzzleSize.cols * puzzleSize.rows){
            setMovePiece(i);
        } else {
            setMovePiece(puzzleSize.cols * puzzleSize.rows);
        }
        console.log(i);
    };*/
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
        pieces[i].x = newX;
        pieces[i].y = newY;
        setPieces(pieces);
    }

    const handleDragEnd = (e,id) => {
        const stage = e.target.getStage();
        const newPosition = stage.getPointerPosition();
        let newPos ={};
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
        pieces[id].prevX = newPos.x;
        pieces[id].prevY = newPos.y;
        setPieces(pieces);
    };

    useEffect(() => {
        (() => {
            if(pieces.length > 0){
            const layer = layerRef.current;
            var movePiece=puzzleSize.cols * puzzleSize.rows;
            /*const rect1 = new Rect({
                stroke: 'black',
                strokeWidth: 3,
                x: 0,
                y: 0,
                width: puzzleSize.cols * PIECE_SIZE*2,
                height: puzzleSize.rows * PIECE_SIZE*1.5
            });
            const rect2 = new Rect({
                stroke: 'black',
                strokeWidth: 3,
                x: 7,
                y: 7,
                width: puzzleSize.cols * PIECE_SIZE+5,
                height: puzzleSize.rows * PIECE_SIZE+5
            });
            layer.add(rect1,rect2);*/
            const groups = []
            for(let i = 0;i < puzzleSize.cols * puzzleSize.rows;i++){
                const group = new Group({
                    x: pieces[i].x,
                    y: pieces[i].y,
                    draggable: true,
                });
                const pieceImage = new Image({
                    image: image,
                    width: PIECE_SIZE,
                    height: PIECE_SIZE,
                });
                pieceImage.crop = {
                    x: pieces[i].cropX,
                    y: pieces[i].cropY,
                    width: pieces[i].cropW,
                    height: pieces[i].cropH,
                };
                const rect = new Rect({
                    width: PIECE_SIZE,
                    height: PIECE_SIZE,
                    stroke: "black",
                    strokeWidth: 1,
                });
                group.on('dragmove',  (e) => { movePiece = pieces[i].order;return handleDragMove(e,i); });
                group.on('dragend',  (e) => { return handleDragEnd(e,i); });
                group.add(pieceImage);
                group.add(rect);
                groups.push(group);
            }
            if(movePiece==puzzleSize.cols * puzzleSize.rows){
                for(let i = 0;i < puzzleSize.cols * puzzleSize.rows;i++){
                    layer.add(groups[i]);
                }
            } else {
                for(let i = 0;i < puzzleSize.cols * puzzleSize.rows;i++){
                    if(i != movePiece){
                        layer.add(groups[i]);
                    }
                }
                layer.add(groups[movePiece]);
            }
            layer.draw();
        }
        })();   
    },[pieces,handleDragMove]);

    const notMovePieces = pieces.filter(piece => piece.order !== movePiece);
    const movePieces = pieces.filter(piece => piece.order === movePiece);

    return (
        <Stage width={puzzleSize.cols * PIECE_SIZE*2} height={puzzleSize.rows * PIECE_SIZE*1.5}>
            <Layer ref={layerRef}/*onMouseDown={mouseMove}*//>
        </Stage>
    );
}
/*<Rect stroke='black' strokeWidth={3} x={0} y={0} width={puzzleSize.cols * PIECE_SIZE*2} height={puzzleSize.rows * PIECE_SIZE*1.5}/>
                <Rect stroke='black' strokeWidth={3} x={7} y={7} width={puzzleSize.cols * PIECE_SIZE+5} height={puzzleSize.rows * PIECE_SIZE+5}/>
                {notMovePieces.map((piece, index) => (
                    <PuzzlePiece key={index} image={image} piece={piece} puzzleSize={puzzleSize} pieces={pieces}/>
                ))}
                {movePieces.map((piece, index) => (
                    <PuzzlePiece key={index} image={image} piece={piece} puzzleSize={puzzleSize} pieces={pieces}/>
                ))}*/
                