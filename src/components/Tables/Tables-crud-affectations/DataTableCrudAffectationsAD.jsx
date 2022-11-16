
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';  
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProductService } from '../../../views/dons/service/ProductService';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';

import { Toolbar } from 'primereact/toolbar';

import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import './DataTableCrud.css';

import { Dropdown } from 'primereact/dropdown';

import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';

import { MultiSelect } from 'primereact/multiselect';

import { Skeleton } from 'primereact/skeleton';


const userItem = 'tokendashlanfi';
const tokenUser = localStorage.getItem(userItem)


const DataTableCrudAffectationsAD = (props) => {
    const navigate = useNavigate()

    let emptyProduct = 
            {
                "beneficiaire": "",
                "typeDons": "argent",
                "montant": "",
                
            };

            

    const [lazyItems, setLazyItems] = useState([]);
    const [lazyLoading, setLazyLoading] = useState(false);

    const [items] = useState(Array.from({ length: 100000 }).map((_, i) => ({ label: `Item #${i}`, value: i })));
    const loadLazyTimeout = useRef(null);

 

    useEffect(() => {
        setLazyItems(Array.from({ length: 100000 }));
        setLazyLoading(false)
    }, []); // eslint-disable-line react-hooks/exhaustive-deps



    const onLazyLoad = (event) => {
        setLazyLoading(true);

        if (loadLazyTimeout.current) {
            clearTimeout(loadLazyTimeout.current);
        }

        //imitate delay of a backend call
        loadLazyTimeout.current = setTimeout(() => {
            const { first, last } = event;
            const _lazyItems = [...lazyItems];

            for (let i = first; i < last; i++) {
                _lazyItems[i] = { label: `Item #${i}`, value: i };
            }

            setLazyItems(_lazyItems);
            setLazyLoading(false);
        }, Math.random() * 1000 + 250);
    }


 
    

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
    const [valu,setValu]=useState([])
    const productService = new ProductService();
    
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
 

    const [activeIndex1, setActiveIndex1] = useState(0);

    const [selectedbeneficiaire, setSelectedbeneficiaire] = useState(null);
    const [selectedmontant, setSelectedmontant] = useState(null);

    const [beneficiaires, setBeneficiaires] = useState([]);
    const [quatiers, setmontants] = useState([]);

    var k = 0
    var j=0
    var js=""
    var tab=[]

    // beneficiaires Liste Dropdown

    useEffect(() => {
        
        productService.getIndividus().then(data => {
         
            if(k==0)
            {

            for(let i=0;i< data.length;i++ )
            {

                js={ name: data[i].user_name  ,  code: data[i].user_name }
                
                tab.push(js)
                
            }
          

            setBeneficiaires(tab)
            
            tab=[]
            js=""

     
            
            k=k+1
        }
        } );

    }, []); 


    // Zones Liste Dropdown

    useEffect(() => {
        
        productService.getAllZones().then(data => {

            if(j==0)
            {
               
            for(let i=0;i< data.length;i++ )
            {

                js={ name: data[i].nomz  ,  code: data[i].nomz }
                
                tab.push(js)
                
            }
          

            setmontants(tab)

            
            tab=[]
            js=""

           
            
            j=j+1
        }
        } );

    }, []); 
    
    

     
    const onCityChangebeneficiaire = (e,name) => {
        let i =0
        let tab = []
        for(let i = 0; i < e.value.length; i++){
            tab.push(e.value[i].code)
            
        }
        
        
        setSelectedbeneficiaire(e.value);

        const val = tab || '';
        let _product = {...product};
        _product[`${name}`] = val;

        setProduct(_product);
      
     
    }
       
    const onCityChangemontant = (e,name) => {
       
        setSelectedmontant(e.value);

        const val = e.value.code || '';
        let _product = {...product};
        _product[`${name}`] = val;

        setProduct(_product);

 
    }
       







    useEffect(() => {
        
        productService.getAllAffectations().then(data =>  setProducts(data));

    }, []); 


    const voirDetailsActeurs=(rowData)=>{
    
        
     

        navigate(props.detailUrl,{
            state:{
                infobeneficiaire:valu,
                beneficiaire:rowData.beneficiaire,
                typeActeur:props.acteursTitle
        }})
    }


    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
        setSelectedbeneficiaire(null)
    }

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    }

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    }

    const saveProduct = () => {
        setSubmitted(true);

        if (product.montant.trim()) {
          
            let _product = {...product};
            if (product.id) {
                const index = findIndexById(product.id);

            
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
            }
            else {
               // _product.id = createId();
                //_product.image = 'product-placeholder.svg';
             
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Affectation réussie', life: 3000 });
            }

          

          
           var data = _product;
           console.log(data);
           var config = {
             method: 'post',
             url: 'https://apivulnerable.herokuapp.com/affecter/',
             headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+tokenUser
              },
             data : data
           };
           
           axios(config)
           .then(function (response) {
         
            
           })
           .catch(function (error) {
             console.log(error);
           });


            setProductDialog(false);
            setProduct(emptyProduct);
            setSelectedbeneficiaire(null)
        }
        

    }


    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    }

    const deleteProduct = () => {
        let _products = products.filter(val => val.id !== product.id);
        setProducts(_products);
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
    }

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < products.length; i++) {
            if (products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
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



    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = {...product};
        _product[`${name}`] = val;

        setProduct(_product);
    }

   

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div  className="d-flex" style={{justifyContent:"space-between"}} >

                    <Button onClick={openNew} className="px-3 p-button-sm p-button-rounded me-5" aria-label="Plus">
                        <i className="pi pi-plus px-2"></i>
                        <span className="px-5">Affecter</span>
                    </Button>
                    <Button className="px-3 p-button-sm p-button-danger p-button-rounded" aria-label="Plus" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length}>
                        <i className="pi pi-trash px-2"></i>
                        <span className="px-5">Supprimer</span>
                    </Button>
                   
                </div>
            </React.Fragment>
        )
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



    const beneficiaireBodyTemplate = (rowData) => {
        return (rowData.beneficiaire);
    }
    const communeBodyTemplate = (rowData) => {
        return rowData.commune;
    }


    const montantTemplate = (rowData) => {
        return rowData.montant
  
    }
    const is_activeTemplate = (rowData) => {
        return(
            <span
            className={`badge badge-success bg-success`}
          >
    {rowData.is_active == true ? 'Oui': ''}
    </span>
        )
  
     
  
    }
    const is_staff = (rowData) => {
        return(
            <span
            className={`badge badge-success bg-success`}
          >
    {rowData.is_staff == true ? 'Oui': ''}
    </span>
        )
  
    }
    const is_beneficiaireTemplate = (rowData) => {
        return(
            <span
            className={`badge badge-success bg-success`}
          >
    {rowData.is_beneficiaire == true ? 'Oui': ''}
    </span>
        )
  
    }
  

    const actionBodyTemplate = (rowData) => {

        return (
            <React.Fragment>
                <Button icon="pi pi-eye" className="p-button-rounded p-button-outlined " onClick={() => voirDetailsActeurs(rowData)} />
            </React.Fragment>
        );
    }



    const productDialogFooter = (
        <React.Fragment>
            <Button label="Annuler" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Valider" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
        </React.Fragment>
    );
    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="Non" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Oui" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </React.Fragment>
    );
    const deleteProductsDialogFooter = (
        <React.Fragment>
            <Button label="Non" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductsDialog} />
            <Button label="Oui" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProducts} />
        </React.Fragment>
    );

       

    return (
        <div className="datatable-crud-demo mt-1">
           <Toast ref={toast} />
                <Toolbar className="mb-4 bg-white border-0" left={leftToolbarTemplate}  ></Toolbar>
            <div className="data-table-container">

                <DataTable ref={dt} value={products} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)}
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Afficher de {first} à {last} de {totalRecords} Acteurs"
                    globalFilter={globalFilter} header={header} responsiveLayout="scroll">
                    <Column selectionMode="multiple" headerStyle={{ width: '2rem' }} exportable={false}></Column>
                    <Column sortable field="beneficiaire" header="beneficiaire" body={beneficiaireBodyTemplate}   style={{ minWidth: '5rem' }}></Column>
                    <Column sortable field="montant" header="montant" body={montantTemplate}  style={{ minWidth: '15rem' }}></Column>
                  
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '1rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={productDialog} style={{ width: '450px' }} header="Affectation argent" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                {product.image && <img src={`images/product/${product.image}`} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={product.image} className="product-image block m-auto pb-3" />}
               
           

                <div className="field">
                    <div className="multiselect-demo">
                    <label htmlFor="beneficiaire">beneficiaire</label>
                            <MultiSelect id="beneficiaire" value={selectedbeneficiaire} options={beneficiaires}  onChange={(e) => onCityChangebeneficiaire(e, 'beneficiaire')} className={classNames({ 'p-invalid': submitted && !product.beneficiaire })} optionLabel="name" display="chip" virtualScrollerOptions={{ lazy: true, onLazyLoad: onLazyLoad, itemSize: 43, showLoader: true, loading: lazyLoading, delay: 250, loadingTemplate: (options) => {
                                return (
                                    <div className="flex align-items-center p-2" style={{ height: '43px' }}>
                                        <Skeleton width={options.even ? '70%' : '60%'} height="1.5rem" />
                                    </div>
                                )}
                            }} maxSelectedLabels={3} placeholder="beneficiaire" showSelectAll={false}/>
                      {submitted && !product.beneficiaire && <small className="p-error">beneficiaire is required.</small>}
           
                    </div>
                  
                </div>

   
                <div className="field">
                    <label htmlFor="montant">Montant (FCFA) </label>
                    <InputText type="number" id="montant" value={product.montant} onChange={(e) => onInputChange(e, 'montant')} required rows={3} cols={20}  className={classNames({ 'p-invalid': submitted && !product.montant })} />
                    {submitted && !product.montant && <small className="p-error">montant is required.</small>}
 
                </div>

         
    
              
            </Dialog>

            <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    {product && <span>Are you sure you want to delete <b>{product.name}</b>?</span>}
                </div>
            </Dialog>

            <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem'}} />
                    {product && <span>Are you sure you want to delete the selected products?</span>}
                </div>
            </Dialog>
        </div>
    );
}

export default DataTableCrudAffectationsAD