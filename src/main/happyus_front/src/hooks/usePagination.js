/**
 * @Explain : 페이징은 컴포넌트 사용시 필요한 공통로직을 custom hook으로 작성
 *            페이징 처리시 해당 hook을 사용
 *
 */
import {useEffect, useState} from "react";

export function usePagination(totalCount) {
    const PAGE_SIZE = 10; // 페이지당 보여줄 item 개수
    const DEFAULT_BUTTON_RANGE = [1, 5];
    const [page, setPage] = useState(1);
    const [buttonRange, setButtonRange] = useState(DEFAULT_BUTTON_RANGE);

    useEffect(() => {
        updateButtonRange();
    }, [page, totalCount]); // 페이지나 totalCount가 바뀔 때마다 updateButtonRange 호출

    function updateButtonRange() {
        if (page < buttonRange[0] || page > buttonRange[1]) {
            let newStartPage = Math.floor((page - 1) / DEFAULT_BUTTON_RANGE[1]) * DEFAULT_BUTTON_RANGE[1] + 1;
            let newEndPage = newStartPage + DEFAULT_BUTTON_RANGE[1] - 1;

            if (newEndPage > Math.ceil(totalCount / PAGE_SIZE))
                newEndPage = Math.ceil(totalCount / PAGE_SIZE);

            setButtonRange([newStartPage, newEndPage]);
        }
    }

    return { page, setPage, buttonRange, PAGE_SIZE };
}
