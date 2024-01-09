import { useState,useEffect } from "react";
import { Layer, Rect,Image, Group } from "react-konva";

const PIECE_SIZE = 80;

export default function PuzzlePiece({ image, piece,puzzleSize,pieces }){
    const [position, setPosition] = useState({ x: piece.x, y: piece.y });
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    useEffect(() => {
        ( ()=>{
            console.log("pieces"+image);
            
        })();
    },[]);
    
    

    const handleDragMove = (e) => {
        const stage = e.target.getStage();
        const mousePos = stage.getPointerPosition();
        let newX = mousePos.x - PIECE_SIZE * 0.5;
        let newY = mousePos.y - PIECE_SIZE * 0.5;
        if (newX < -PIECE_SIZE / 2){
            newX = -PIECE_SIZE / 2;
        }
        if (newY < -PIECE_SIZE / 2){
            newY = -PIECE_SIZE / 2;
        }
        if (newX > stage.width() - PIECE_SIZE / 2){
            newX = stage.width() - PIECE_SIZE / 2;
        }
        if (newY > stage.height() - PIECE_SIZE / 2){
            newY = stage.height() - PIECE_SIZE / 2;
        }
        console.log(newX,newY);
        setPosition({ x: newX, y: newY });
    }

    const handleDragEnd = (e) => {
        const stage = e.target.getStage();
        const newPosition = stage.getPointerPosition();
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
                        newPos = { x: piece.prevX, y: piece.prevY };
                    }
                }
            } else {
                setPosition({ x: 10+piece.position % 8 * 80, y: 10+Math.floor(piece.position / 8) * 80});
                newPos = { x: 10+piece.position % 8 * 80, y: 10+Math.floor(piece.position / 8) * 80};
            }
        } else {
            pieces[piece.order].position = puzzleSize.cols * puzzleSize.rows;
            let newX = newPosition.x - PIECE_SIZE * 0.5;
            let newY = newPosition.y - PIECE_SIZE * 0.5;
            if (newX < -PIECE_SIZE / 2){
                newX = -PIECE_SIZE / 2;
            }
            if (newY < -PIECE_SIZE / 2){
                newY = -PIECE_SIZE / 2;
            }
            if (newX > stage.width() - PIECE_SIZE / 2){
                newX = stage.width() - PIECE_SIZE / 2;
            }
            if (newY > stage.height() - PIECE_SIZE / 2){
                newY = stage.height() - PIECE_SIZE / 2;
            }
            setPosition({ x: newX, y: newY });
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
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
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