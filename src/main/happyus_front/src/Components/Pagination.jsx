import React from 'react';

function Pagination({buttonRange, totalCount, setPage}) {
    return (
        <div style={{display: 'flex', justifyContent: 'center', gap: '10px'}}>
            {/* 이전페이지 버튼 */}
            {buttonRange[0] > 1 && (<button onClick={() => setPage(buttonRange[0] - 1)}>Previous</button>)}

            {/* 숫자버튼 생성 */}
            {[...Array(buttonRange[1] - buttonRange[0] + 1)].map((_, i) => (
                buttonRange[0] + i <= Math.ceil(totalCount / 10) &&
                (<button key={i} onClick={() => setPage(buttonRange[0] + i)}>{buttonRange[0] + i}</button>)
            ))}

            {/* 다음페이지 버튼 */}
            {Math.ceil(totalCount / 10) > buttonRange[1] &&
                (<button onClick={() => setPage(buttonRange[1] + 1)}>Next</button>)}
        </div>
    );
}

export default Pagination;
