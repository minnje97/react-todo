import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "./atoms";
import Board, { IForm } from "./Components/Board";
import { useForm } from "react-hook-form";

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.bgColor};
  display: flex;
  flex-direction: column;
  max-width: 680px;
  width: 100%;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const CreateBoard = styled.div``;

const CBform = styled.form`
  margin-bottom: 15px;
`;

const CBinput = styled.input`
  border: none;
  font-size: 14px;
  padding: 10px;
  border-radius: 3px;
`;

const CBbutton = styled.button`
  position: relative;
  right: 8px;
`;

const Boards = styled.div`
  display: grid;
  width: 100%;
  gap: 10px;
  grid-template-columns: repeat(3, 1fr);
`;

function App() {
  const { register, handleSubmit, setValue } = useForm<IForm>();
  const [toDos, setToDos] = useRecoilState(toDoState);
  const onDragEnd = (info: DropResult) => {
    const { destination, draggableId, source } = info;
    if (!destination) return;
    if (destination?.droppableId === source.droppableId) {
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[destination.droppableId]];
        const cutCopyObj = boardCopy[source.index];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination.index, 0, cutCopyObj);
        return {
          ...allBoards,
          [destination.droppableId]: boardCopy,
        };
      });
    }
    if (destination.droppableId !== source.droppableId) {
      setToDos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        const destBoard = [...allBoards[destination.droppableId]];
        const cutCopyObj = sourceBoard[source.index];
        sourceBoard.splice(source.index, 1);
        destBoard.splice(destination.index, 0, cutCopyObj);
        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destBoard,
        };
      });
    }
  };
  const onValid = ({ category }: IForm) => {
    setToDos((allBoards) => {
      return {
        [category]: [],
        ...allBoards,
      };
    });
    setValue("category", "");
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <>
          <CreateBoard>
            <CBform onSubmit={handleSubmit(onValid)}>
              <CBinput
                {...register("category", { required: true })}
                type="text"
                placeholder="새로운 카테고리 이름"
              ></CBinput>
              <CBbutton>추가</CBbutton>
            </CBform>
          </CreateBoard>
          <Boards>
            {Object.keys(toDos).map((boardId) => (
              <Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />
            ))}
          </Boards>
        </>
      </Wrapper>
    </DragDropContext>
  );
}

export default App;
