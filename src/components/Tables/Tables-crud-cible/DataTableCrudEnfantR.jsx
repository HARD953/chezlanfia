
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Checkbox } from 'primereact/checkbox';

import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProductService } from '../../../views/dons/service/ProductService';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import './DataTableCrud.css';
import { TextArea } from 'semantic-ui-react';

const DataTableCrudEnfantR= (props) => {
    const navigate = useNavigate()

    let emptyProduct = {
        "password": "",
        "user_name": "",
        "email": "",
        "last_name": "",
        "first_name": "",
        "annee_nais": "",
        "lieu_nais": "",
        "sexe": "",
        "niveau_etude": "",
        "commune": "",
        "quartier": "",
        "handicap": "",
        "maladie": "",
        "pere": true,
        "mere":true,
        "tuteur": true,
        "tutrice":true,
        "battu": true,
        "scolariser": true
      };

    const [products, setProducts] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    const productService = new ProductService();


    const [cities, setCities] = useState([]);




    useEffect(() => {
        
        productService.getEnfants().then(data =>  setProducts(data));

    }, []); 


    const voirDetailsActeurs=()=>{
        navigate(props.detailUrl,{
            state:{
                idActeur:55,
                typeActeur:props.acteursTitle
        }})
    }

 


    const exportCSV = () => {
        dt.current.exportCSV();
    }

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    }

    const deleteSelectedProducts = () => {
        let _products = products.filter(val => !selectedProducts.includes(val));
        setProducts(_products);
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    }

    const onCategoryChange = (e) => {
        let _product = {...product};
        _product['category'] = e.value;
        setProduct(_product);
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = {...product};
        _product[`${name}`] = val;

        setProduct(_product);
    }

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _product = {...product};
        _product[`${name}`] = val;

        setProduct(_product);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div  className="d-flex" style={{justifyContent:"space-between"}} >

                  
                   
                </div>
            </React.Fragment>
        )
    }

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div  className="d-flex" style={{justifyContent:"space-between",justifyItems:"center"}} >
                    <Button  onClick={exportCSV} className="px-3 p-button-sm p-button-rounded p-button-outlined p-button-raised p-button-help me-5" aria-label="Plus">
                        <i className="pi pi-upload px-2"></i>
                        <span className="px-5">Exporter</span>
                    </Button>
                    <div className=" font-weight-bold" style={{fontWeight:"bold"}} >
                        <p>
                            <span className="me-3" >
                            {products ==null ?'0':products.length }
                            </span>
                            {props.acteursTitle}
                        </p>
                    </div>
                </div>

            </React.Fragment>
        )
    }

    const owner1BodyTemplate = (rowData) => {
        return (rowData.owner1);
    }
    const last_nameBodyTemplate = (rowData) => {
        return rowData.last_name;
    }

    const first_nameBodyTemplate = (rowData) => {
        return rowData.first_name;
    }
    const sexeTemplate = (rowData) => {
        return rowData.sexe
  
    }
    const pereTemplate = (rowData) => {
        return(
            <span
            className={`badge badge-success bg-success`}
          >
    {rowData.pere == true ? 'Oui': ''}
    </span>
        )
  
   
  
    }
    const mereTemplate = (rowData) => {
        return(
            <span
            className={`badge badge-success bg-success`}
          >
    {rowData.mere == true ? 'Oui': ''}
    </span>
        )
  
  
    }
    const tuteurTemplate = (rowData) => {
        return(
            <span
            className={`badge badge-success bg-success`}
          >
    {rowData.tuteur == true ? 'Oui': ''}
    </span>
        )
  
  
    }
    const tutriceTemplate = (rowData) => {
        return(
            <span
            className={`badge badge-success bg-success`}
          >
    {rowData.tutrice == true ? 'Oui': ''}
    </span>
        )
  
  
    }
    const battuTemplate = (rowData) => {
        return(
            <span
            className={`badge badge-success bg-success`}
          >
    {rowData.battu == true ? 'Oui': ''}
    </span>
        )
  
  
    }
    const scolariserTemplate = (rowData) => {
        return(
            <span
            className={`badge badge-success bg-success`}
          >
    {rowData.scolariser == true ? 'Oui': ''}
    </span>
        )
  
  
    }
    const annee_naisTemplate = (rowData) => {
        return rowData.annee_nais;
  
    }
    const quartierTemplate = (rowData) => {
        return rowData.quartier
  
    }
    const communeTemplate = (rowData) => {
        return(
   
    rowData.commune 
   
        )
    }
    const lieu_nais = (rowData) => {
        return(
      
    rowData.lieu_nais
  
        )
  
    
  
  
    }
  
  

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-eye" className="p-button-rounded p-button-outlined " onClick={() => voirDetailsActeurs()} />
            </React.Fragment>
        );
    }

    const header = (
        <div className="table-header">
            <h4 className="mx-0 my-1 "> {props.acteursTitle} <span className='p-badge p-badge-info'>{products== null ? "0": products.length}</span></h4>
        
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Rechercher..." />
            </span>
            <Button  onClick={exportCSV} className="px-3 p-button-sm p-button-rounded p-button-outlined p-button-raised p-button-help me-5" aria-label="Plus">
                        <i className="pi pi-upload px-2"></i>
                        <span className="px-5">Exporter</span>
            </Button>
        </div>
    );


   

    return (
        <div className="datatable-crud-demo mt-1">
           <Toast ref={toast} />
                <div className="data-table-container">

                <DataTable ref={dt} value={products} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Afficher de {first} à {last} de {totalRecords} Acteurs"
                    globalFilter={globalFilter} header={header} responsiveLayout="scroll">
                    <Column selectionMode="multiple" headerStyle={{ width: '2rem' }} exportable={false}></Column>
                    <Column sortable field="owner1" header="owner1" body={owner1BodyTemplate}   style={{ minWidth: '5rem' }}></Column>
                    <Column sortable field="last_name" header="last_name " body={last_nameBodyTemplate}   style={{ minWidth: '16rem' }}></Column>
                    <Column sortable field="first_name" header="first_name" body={first_nameBodyTemplate}  style={{ minWidth: '16rem' }}></Column>
                    <Column sortable field="sexe" header="Sexe" body={sexeTemplate}  style={{ minWidth: '15rem' }}></Column>
                   
                    <Column sortable field="annee_nais" header="annee_nais" body={annee_naisTemplate}  style={{ minWidth: '15rem' }}></Column>
                    <Column sortable field="commune" header="Commune " body={communeTemplate}  style={{ minWidth: '10rem' }}></Column>
           
                    <Column sortable field="quartier" header="Sous-préfecture" body={quartierTemplate}  style={{ minWidth: '15rem' }}></Column>
                    <Column sortable field="lieu_nais" header="Lieu Naissance " body={lieu_nais}  style={{ minWidth: '15rem' }}></Column>
                    <Column sortable field="pere" header="pere" body={pereTemplate}  style={{ minWidth: '10rem' }}></Column>
                    <Column sortable field="mere" header="mere" body={mereTemplate}  style={{ minWidth: '10rem' }}></Column>
                    <Column sortable field="tuteur" header="tuteur" body={tuteurTemplate}  style={{ minWidth: '10rem' }}></Column>
                    <Column sortable field="tutrice" header="tutrice" body={tutriceTemplate}  style={{ minWidth: '10rem' }}></Column>
                    <Column sortable field="battu" header="battu" body={battuTemplate}  style={{ minWidth: '10rem' }}></Column>
                    <Column sortable field="scolariser" header="Scolariser" body={scolariserTemplate}  style={{ minWidth: '10rem' }}></Column>
              

                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '1rem' }}></Column>
                </DataTable>
            </div>

     

        </div>
    );
}

export default DataTableCrudEnfantR