import PDFViewer from 'components/file_viewer/pdf_viewer';
import { EuiTabs, EuiTab } from '@elastic/eui';
import { actions, useAppDispatch, useAppSelector } from 'store/provider';
import { useEffect, useMemo } from 'react';
import "styles/euitabs.css"

export default function FilesViewer({ files }) {
    const fileTabs = useMemo(() => files.map((file,index) => {
        const extension = file.fileExtension
        if (extension === 'pdf') {
            return {
                name: file.file.name,
                id: `filetab-${index}`,
                content: <PDFViewer file={file.file} />
            }
        }
    }), [files]);

    const activeFilesTab = useAppSelector((state) => state.activeFilesTab)
    const dispatch = useAppDispatch()
    const onFileTabClick = (tab) => {
        dispatch(actions.setActiveFilesTab({ activeFilesTab: tab.id }))
    }

    useEffect(() => {
        if (fileTabs.length > 0) {
            dispatch(actions.setActiveFilesTab({ activeFilesTab: fileTabs[0].id }))
        }
    }, [fileTabs])

    const selectedFileTabContent = useMemo(() => {
        return fileTabs.find((tab) => tab.id === activeFilesTab)?.content;
    }, [activeFilesTab]);

    return (
        <div className='col-span-2 border-l' style={{ height: 'calc(100vh - 127px)' }}>
            <EuiTabs size="s" className='border-l border-black border-opacity-30'>
                {fileTabs.map((tab) => (
                    <EuiTab
                        id={tab.id}
                        onClick={() => { onFileTabClick(tab) }}
                        isSelected={tab.id === activeFilesTab}
                        key={tab.id}
                        data-test-subj={`file-tab-${tab.id}`}
                        aria-controls={`file-tabpanel-${tab.id}`}
                    >
                        {tab.name}
                    </EuiTab>
                ))}
            </EuiTabs>
            {selectedFileTabContent}
        </div>
    )
}
