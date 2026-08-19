import React from 'react';
import './ErpInventoryMapper.css';

const ErpInventoryMapper = () => {
    return (
        <div className="erp-page">

            <section className="erp-hero erp-card">
                <div>
                    <div className="erp-eyebrow">SUBMISSION &amp; INGEST</div>

                    <h1>
                        ERP <span>Inventory Mapper</span>
                    </h1>

                    <p>
                        Upload inventory batches and automatically map local item codes
                        to NHCX-ready LOINC and NAMASTE terminology before claim submission.
                    </p>
                </div>

                <div className="erp-hero-badge">
                    <span className="material-symbols-outlined">auto_awesome</span>
                    Zero-shot mapping
                </div>
            </section>


            <section className="erp-main-grid">

                <div className="erp-card erp-upload-card">

                    <div className="erp-section-header">
                        <div>
                            <span className="erp-section-label">
                                INVENTORY INGESTION
                            </span>

                            <h2>Upload inventory batch</h2>

                            <p>
                                Select an inventory file to begin automated terminology mapping.
                            </p>
                        </div>

                        <div className="erp-icon-box">
                            <span className="material-symbols-outlined">
                                cloud_upload
                            </span>
                        </div>
                    </div>


                    <label className="erp-upload-zone">

                        <div className="erp-upload-icon">
                            <span className="material-symbols-outlined">
                                upload_file
                            </span>
                        </div>

                        <h3>Drop your inventory file here</h3>

                        <p>
                            Drag and drop your file or browse your computer
                        </p>

                        <span className="erp-browse-button">
                            Browse files
                        </span>

                        <small>
                            Supported formats: CSV, XLSX, PDF
                        </small>

                        <input
                            type="file"
                            multiple
                            className="erp-file-input"
                        />

                    </label>


                    <div className="erp-upload-footer">

                        <div className="erp-upload-info">
                            <span className="material-symbols-outlined">
                                info
                            </span>

                            <span>
                                Multiple files can be uploaded together
                            </span>
                        </div>

                        <button
                            type="button"
                            className="erp-primary-button"
                        >
                            Start mapping
                            <span className="material-symbols-outlined">
                                arrow_forward
                            </span>
                        </button>

                    </div>

                </div>


                <aside className="erp-card erp-rules-card">

                    <div className="erp-section-header">

                        <div>
                            <span className="erp-section-label">
                                AUTOMATION
                            </span>

                            <h2>Mapping rules</h2>

                            <p>
                                Rules applied during inventory processing.
                            </p>
                        </div>

                        <div className="erp-icon-box">
                            <span className="material-symbols-outlined">
                                rule
                            </span>
                        </div>

                    </div>


                    <div className="erp-rules">

                        <div className="erp-rule">

                            <div className="erp-rule-number">
                                01
                            </div>

                            <div className="erp-rule-content">

                                <div className="erp-rule-title">
                                    <span className="material-symbols-outlined">
                                        science
                                    </span>

                                    LOINC matching
                                </div>

                                <p>
                                    Maps diagnostic and laboratory items to standardized
                                    LOINC terminology.
                                </p>

                            </div>

                            <span className="material-symbols-outlined erp-check">
                                check_circle
                            </span>

                        </div>


                        <div className="erp-rule">

                            <div className="erp-rule-number">
                                02
                            </div>

                            <div className="erp-rule-content">

                                <div className="erp-rule-title">
                                    <span className="material-symbols-outlined">
                                        inventory_2
                                    </span>

                                    NAMASTE matching
                                </div>

                                <p>
                                    Standardizes devices, consumables and related inventory
                                    terminology.
                                </p>

                            </div>

                            <span className="material-symbols-outlined erp-check">
                                check_circle
                            </span>

                        </div>


                        <div className="erp-rule">

                            <div className="erp-rule-number">
                                03
                            </div>

                            <div className="erp-rule-content">

                                <div className="erp-rule-title">
                                    <span className="material-symbols-outlined">
                                        fact_check
                                    </span>

                                    Human review queue
                                </div>

                                <p>
                                    Low-confidence mappings are flagged for manual verification.
                                </p>

                            </div>

                            <span className="material-symbols-outlined erp-check">
                                check_circle
                            </span>

                        </div>

                    </div>

                </aside>

            </section>


            <section className="erp-card erp-activity-card">

                <div className="erp-activity-header">

                    <div>
                        <span className="erp-section-label">
                            ACTIVITY
                        </span>

                        <h2>Recent mapping activity</h2>

                        <p>
                            Overview of recently processed inventory batches.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="erp-secondary-button"
                    >
                        View all
                        <span className="material-symbols-outlined">
                            arrow_forward
                        </span>
                    </button>

                </div>


                <div className="erp-table-wrapper">

                    <table className="erp-table">

                        <thead>
                            <tr>
                                <th>Batch</th>
                                <th>Items</th>
                                <th>Match rate</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>

                            <tr>

                                <td>
                                    <div className="erp-file-cell">

                                        <div className="erp-file-icon csv">
                                            <span className="material-symbols-outlined">
                                                description
                                            </span>
                                        </div>

                                        <div>
                                            <strong>
                                                Apollo_Mumbai_Aug.csv
                                            </strong>

                                            <span>
                                                CSV inventory batch
                                            </span>
                                        </div>

                                    </div>
                                </td>

                                <td>
                                    <strong>248</strong>
                                </td>

                                <td>
                                    <div className="erp-match-rate">
                                        <strong>96.8%</strong>

                                        <div className="erp-progress">
                                            <span style={{ width: '96.8%' }} />
                                        </div>
                                    </div>
                                </td>

                                <td>
                                    <span className="erp-status ready">
                                        <span />
                                        Ready
                                    </span>
                                </td>

                            </tr>


                            <tr>

                                <td>
                                    <div className="erp-file-cell">

                                        <div className="erp-file-icon pdf">
                                            <span className="material-symbols-outlined">
                                                picture_as_pdf
                                            </span>
                                        </div>

                                        <div>
                                            <strong>
                                                Surgical_Stock_118.pdf
                                            </strong>

                                            <span>
                                                Invoice PDF
                                            </span>
                                        </div>

                                    </div>
                                </td>

                                <td>
                                    <strong>76</strong>
                                </td>

                                <td>
                                    <div className="erp-match-rate">
                                        <strong className="warning">
                                            84.2%
                                        </strong>

                                        <div className="erp-progress warning-progress">
                                            <span style={{ width: '84.2%' }} />
                                        </div>
                                    </div>
                                </td>

                                <td>
                                    <span className="erp-status review">
                                        <span />
                                        Review needed
                                    </span>
                                </td>

                            </tr>

                        </tbody>

                    </table>

                </div>

            </section>

        </div>
    );
};

export default ErpInventoryMapper;