import { useState,useEffect } from "react";
import { Layer, Rect,Image, Group } from "react-konva";

const PIECE_SIZE = 80;

export default function PuzzlePiece({ image, piece,puzzleSize,pieces }){
    const [position, setPosition] = useState({ x: piece.x, y: piece.y });

    useEffect(() => {
        ( ()=>{
            console.log("pieces"+image);
            console.log("hello");
        })();
    },[]);
    
    

    const handleDrag = (e) => {
        const newPosition = e.target.getStage().getPointerPosition();
        console.log(newPosition.x,newPosition.y);
        setPosition({ x: newPosition.x - PIECE_SIZE / 2, y: newPosition.y - PIECE_SIZE / 2 });
    };

    const handleDragEnd = (e) => {
        const newPosition = e.target.getStage().getPointerPosition();
        let newPos ={};
        if(0 <= newPosition.x && puzzleSize.cols*PIECE_SIZE >= newPosition.x && 0 <= newPosition.y && puzzleSize.rows * PIECE_SIZE >= newPosition.y ){
            const pos = Math.floor(newPosition.y / 80) * 8 + Math.floor(newPosition.x / 80);
            if(pos != piece.position){
                let i = 0;
                while(i < puzzleSize.cols * puzzleSize.rows && pos != pieces[i].position){
                    i++;
                }
                if(i == puzzleSize.cols * puzzleSize.rows){
                    setPosition({ x: 10+Math.floor(newPosition.x / 80)*80, y: 10+Math.floor(newPosition.y / 80)*80});
                    newPos = { x: 10+Math.floor(newPosition.x / 80)*80, y: 10+Math.floor(newPosition.y / 80)*80};
                    pieces[piece.order].position = pos;
                } else {
                    if(piece.position < puzzleSize.cols * puzzleSize.rows){
                        setPosition({ x: 10+piece.position % 8 * 80, y: 10+Math.floor(piece.position / 8) * 80});
                        newPos = { x: 10+piece.position % 8 * 80, y: 10+Math.floor(piece.position / 8) * 80};
                    } else {
                        setPosition({ x: piece.prevX, y: piece.prevY });
                    }
                }
            } else {
                setPosition({ x: 10+piece.position % 8 * 80, y: 10+Math.floor(piece.position / 8) * 80});
                newPos = { x: 10+piece.position % 8 * 80, y: 10+Math.floor(piece.position / 8) * 80};
            }
        } else {
            pieces[piece.order].position = puzzleSize.cols * puzzleSize.rows;
            newPos = { x: newPosition.x,y: newPosition.y};
        }
        pieces[piece.order].prevX = newPos.x;
        pieces[piece.order].prevY = newPos.y;

    };

    
    return (
        <>
        <Group
        x={position.x}
        y={position.y}
        draggable
        onMouseDown={handleDrag}
        onMouseUp={handleDragEnd}
        >
        <Image
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
        </>
    );
}