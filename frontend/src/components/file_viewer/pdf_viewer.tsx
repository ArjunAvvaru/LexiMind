import React, { useState, useEffect, useRef } from 'react'
import { Worker, Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import {pageNavigationPlugin} from '@react-pdf-viewer/page-navigation';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { useAppSelector } from 'store/provider';

declare function structuredClone<T>(value: T): T;

export default function PDFViewer({ file }) {
    const [fileURL, setFileURL] = useState<string | null>(null);
    const activeFileViewerPage = useAppSelector((state) => state.activeFileViewerPage);

    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.js`;
    const pageNavigationPluginInstance = pageNavigationPlugin();
    const {jumpToPage} = pageNavigationPluginInstance;

    const loaded = useRef(false);

    useEffect(() => {
        setFileURL(URL.createObjectURL(file));
    }, [file]);

    useEffect(() => {
        if (loaded.current) {
            jumpToPage(Number(activeFileViewerPage)-1);
        }
    }, [activeFileViewerPage]);

    const handleDocumentLoad = () => {
        loaded.current = true;
        jumpToPage(Number(activeFileViewerPage)-1);
    }

    return (
        <Worker workerUrl={workerSrc}>
            {fileURL && <Viewer fileUrl={fileURL} plugins={[defaultLayoutPluginInstance,pageNavigationPluginInstance]} defaultScale={SpecialZoomLevel.PageFit} enableSmoothScroll={true} onDocumentLoad={handleDocumentLoad}  theme="light"/>}
        </Worker>
    )
}