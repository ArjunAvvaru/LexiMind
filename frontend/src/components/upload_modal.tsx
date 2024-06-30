import React, { useState, useEffect, memo } from 'react'
import {
    actions,
    AppStatus,
    thunkActions,
    useAppDispatch,
    useAppSelector,
} from 'store/provider'
import {
    EuiModal,
    EuiModalBody,
    EuiModalHeader,
    EuiModalHeaderTitle,
    EuiThemeProvider,
} from '@elastic/eui';
import { FilePond, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import '../styles/upload_modal.css'
import { remove } from 'lodash';
import { exit } from 'process';

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);
class FatalError extends Error { }
class RetriableError extends Error { }


const UploadModal = memo(() => {
    const API_HOST = process.env.REACT_APP_API_HOST || (window.location.hostname === 'localhost' ? 'http://localhost:3001/api' : 'http://10.10.128.20:3001/api');
    const dispatch = useAppDispatch();
    const files = useAppSelector((state) => state.files);
    var sessionId = useAppSelector((state) => state.sessionId);

    const closeUploadModal = () => {
        dispatch(actions.setUploadModal({ isUploadModalVisible: false }))
      }

    const [isModalCloseEnabled, setIsModalCloseEnabled] = useState(true);

    useEffect(() => {
        const keyListener = (e) => {
            if (e.key === "Escape") {
                e.preventDefault();
            }
        };
        document.addEventListener("keydown", keyListener);
        return () => document.removeEventListener("keydown", keyListener);
    }, [isModalCloseEnabled]);

    useEffect(() => {
        return () => {
            dispatch(actions.setSessionId({ sessionId: sessionId }));
        };
    }, []);

    const getFiles = (files) => {
        return files.map(file => {
            const filepond_file= {
                source: file.serverId,
                serverId: file.serverId,
                options: {
                    type: 'local',
                    file: file.file
                },
            };
            filepond_file.options.file.serverId = file.serverId;
            return filepond_file;
        });
    };

    const onProcessFileStart = (file) => {
        dispatch(actions.setActiveFileViewerPage({ activeFileViewerPage: 1}))
        dispatch(actions.setActiveTab({ activeTab: "Chat" }))
        dispatch(actions.setStatus({ status: AppStatus.StreamingMessage }));
    }

    const removeFile = (error, file) => {
        if (file.origin === 1) return;
        const serverId = file.serverId;
        if (!serverId) return;
        fetch(`${API_HOST}/delete/${serverId}`, { method: 'DELETE' })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
            })
            .catch(error => console.error('There has been a problem with your fetch operation: ', error));
        dispatch(actions.removeFile({ file: file.file.serverId }));
    };

    const serverConfig = {
        url: API_HOST,
        process: (fieldName, file, metadata, load, error, progress, abort, transfer, options) => {
            const formData = new FormData();
            const request_body = {}
            formData.append(fieldName, file, file.name);

            let abortController = new AbortController()
            let countRetriesError = 0
            fetchEventSource(
                `${API_HOST}/upload?${sessionId ? `session_id=${sessionId}&` : ''}`,
                {
                    method: 'POST',
                    body: formData,
                    openWhenHidden: true,
                    signal: abortController.signal,
                    async onmessage(event) {
                        if (event.event === 'FatalError') {
                            throw new FatalError(event.data)
                        }
                        if (event.data.startsWith("[PROGRESS]")) {
                            const progressPercent = parseFloat(event.data.split(' ')[1].trim())
                            progress(true, progressPercent * file.size, file.size);
                        } else if (event.data.startsWith("[SESSION_ID]")) {
                            sessionId = event.data.split(' ')[1].trim()
                        }
                        else {
                            load(event.data);
                        }
                    },
                    async onopen(response) {

                        if (response.ok) {
                          return
                        } else if (
                          response.status >= 400 &&
                          response.status < 500 &&
                          response.status !== 429
                        ) {
                          throw new FatalError()
                        } else {
                          throw new RetriableError()
                        }
                      },
                      onerror(err) {
                        if (err instanceof FatalError || countRetriesError > 3) {
                            abortController.abort()
                            abort()  
                          throw err
                        } else {
                          countRetriesError++
                          console.error(err)
                        }
                      },
                }
            )

            return {
                abort: () => {
                    abortController.abort()
                    abort()
                }
            }
        },
        revert: async (filename, load, error) => {
            const response = await fetch(`api/delete/${filename}`, { method: 'DELETE' });
            if (response.status === 200) {
                // load();
            } else {
                error('Failed to delete file.');
            }
            dispatch(actions.removeFile({ file: filename }))
        },
    };

    return (
        <EuiThemeProvider colorMode='dark'>
            <EuiModal onClose={closeUploadModal} className='w-[90vw]'>
                <EuiModalHeader>
                    <EuiModalHeaderTitle >Upload Documents</EuiModalHeaderTitle>
                </EuiModalHeader>
                <EuiModalBody className="mx-5">
                    <FilePond
                        files={getFiles(files)}
                        onupdatefiles={(files) => { dispatch(actions.setFiles({ files })) }}
                        dropOnPage={true}
                        onremovefile={removeFile}
                        onprocessfilestart={onProcessFileStart}
                        allowMultiple={true}
                        server={serverConfig}
                        name="files"
                        labelIdle='<span class=" text-xs text-white font-light">Drag & Drop your files or <span class="filepond--label-action">Browse</span></span>'
                        maxParallelUploads={1}
                        styleButtonRemoveItemPosition="right"
                        labelFileProcessing='Processing...'
                        labelFileProcessingComplete='Upload complete'
                    />
                </EuiModalBody>
            </EuiModal>
        </EuiThemeProvider>
    );
});

export default UploadModal;