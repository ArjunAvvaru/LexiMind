import React, { useState } from 'react';
import { useAppDispatch, useAppSelector,actions, thunkActions } from 'store/provider';
import { EuiFlexGroup, EuiFlexItem, EuiPagination } from '@elastic/eui';

export default function Pagination ({query}) {
    const dispatch = useAppDispatch()
    const activePage = useAppSelector((state) => state.results_page)
    const PAGE_COUNT = useAppSelector((state) => state.results_total_pages)
    const setActivePage = (activePage: number) => {
        dispatch(actions.setResultsPage({results_page: activePage}))
        dispatch(thunkActions.searchOnly(query))
    }

  return ( PAGE_COUNT>0 ?       
        <EuiFlexItem grow={false}>
            <EuiPagination
            aria-label="Search pagination"
            pageCount={PAGE_COUNT}
            activePage={activePage}
            onPageClick={(activePage) => setActivePage(activePage)}
            />
        </EuiFlexItem> : null
  );
}