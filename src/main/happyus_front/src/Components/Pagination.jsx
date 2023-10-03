import React, {useState} from 'react';
import "./Pagination.css"

function Pagination({buttonRange, totalCount, setPage}) {

    const [selectedPage, setSelectedPage] = useState(1);

    const handleClick = (pageNum) => {
        setPage(pageNum);
        setSelectedPage(pageNum);
    }
    return (
        <div className="pagination-container">
            {/* 이전페이지 버튼 생성 조건*/}
            {buttonRange[0] > 1 && (<button className="pagination-button" onClick={() => setPage(buttonRange[0] - 1)}>Previous</button>)}

            {/* 숫자버튼 생성 조건*/}
            { [...Array(buttonRange[1] - buttonRange[0] + 1)].map( (_, i) => (
                //만약 buttonRange[0] + i <= Math.ceil(totalCount / 10)이 참(true)이면,
                // 그 다음에 오는 <button>...</button> 코드(즉, 버튼 요소)를 반환
                buttonRange[0] + i <= Math.ceil(totalCount / buttonRange[1]) &&
                (<button
                    key={i}
                    className={`pagination-button ${buttonRange[0] + i === selectedPage ? 'selected' : ''}`}
                    onClick={() => handleClick(buttonRange[0] + i)}
                >
                    {buttonRange[0] + i}
                </button>)
            ) ) }

            {/* 다음페이지 버튼 생성조건 */}
            {Math.ceil(totalCount / buttonRange[1]) > buttonRange[1] &&
                (<button className="pagination-button" onClick={() => setPage(buttonRange[1] + 1)}>Next</button>)}
        </div>
    );
}

export default Pagination;
