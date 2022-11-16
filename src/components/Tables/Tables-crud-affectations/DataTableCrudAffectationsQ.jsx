
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
import { InputTextarea } from 'primereact/inputtextarea';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import './DataTableCrud.css';

import { Dropdown } from 'primereact/dropdown';
import { WithContext as ReactTags } from 'react-tag-input';


const userItem = 'tokendashlanfi';
const tokenUser = localStorage.getItem(userItem)


const DataTableCrudAffectationsQ = (props) => {
    const navigate = useNavigate()

    let emptyProduct = 
    {
                "commune": "",
                "quartier": "",
                "status":false
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
    const [valu,setValu]=useState([])
    const productService = new ProductService();
    
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
 

    const [activeIndex1, setActiveIndex1] = useState(0);

    const [selectedcommune, setselectedcommune] = useState(null);
    const [selectedQuartier, setSelectedQuartier] = useState(null);

    const [communes, setCommunes] = useState([]);
    const [quatiers, setQuartiers] = useState([]);
    
    const KeyCodes = {
        comma: 188,
        enter: 13
      };
      
      const delimiters = [KeyCodes.comma, KeyCodes.enter];
      
     
        const [tags, setTags] = React.useState([]);
      
        const handleDelete = i => {
          setTags(tags.filter((tag, index) => index !== i));
        };
      
        const handleAddition = tag => {
          setTags([...tags, tag]);
        };
      
        const handleDrag = (tag, currPos, newPos) => {
          const newTags = tags.slice();
      
          newTags.splice(currPos, 1);
          newTags.splice(newPos, 0, tag);
      
          // re-render
          setTags(newTags);
        };
      
        const handleTagClick = index => {
          console.log('The tag at index ' + index + ' was clicked');
        }

    var k = 0
    var j=0
    var js=""
    var tab=[]

         // Communes Liste Dropdown
        

    useEffect(() => {
        
        productService.getAllCommunes().then(data => {

            
            if(j==0)
            {
               
            for(let i=0;i< data.length;i++ )
            {

                js={ name: data[i].COMMUNE ,  code: data[i].COMMUNE }
                
                tab.push(js)
                
            }
          

            setCommunes(tab)

            
            tab=[]
            js=""

           
            
            j=j+1
        }
        });

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
          

            setQuartiers(tab)

            
            tab=[]
            js=""

           
            
            j=j+1
        }
        } );

    }, []); 
    
    

     
    const onCityChangecommune = (e,name) => {
        
     
        setselectedcommune(e.value);

        const val = e.value.code || '';
        let _product = {...product};
        _product[`${name}`] = val;

        setProduct(_product);
     
    }
       
    const onCityChangeQuartier = (e,name) => {
       
        setSelectedQuartier(e.value);

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
                infocommune:valu,
                communecommune:rowData.commune,
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
    }

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    }

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    }

    const saveProduct = () => {
        setSubmitted(true);

        if (product.commune.trim() && product.quartier.trim()) {
            let _products = [...products];
            let _product = {...product};
            if (product.id) {
                const index = findIndexById(product.id);

                _products[index] = _product;
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
            }
            else {
               // _product.id = createId();
                //_product.image = 'product-placeholder.svg';
                _products.push(_product);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Affectation réussie', life: 3000 });
            }

            setProducts(_products);

          
           var data = _product;
           
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
                        <span className="px-5">Ajouter</span>
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



    const communeBodyTemplate = (rowData) => {
        return (rowData.commune);
    }

  
    const quartierTemplate = (rowData) => {
        return rowData.quartier
  
    }
    const q2Template = (rowData) => {
        return rowData.q2;
  
    }
    const q3Template = (rowData) => {
        return rowData.q3;
  
    }
    const q4Template = (rowData) => {
        return rowData.q4
  
    }
    const q5Template = (rowData) => {
        return rowData.q5;
  
    }
    const q6Template = (rowData) => {
        return rowData.q6;
  
    }
    const about_meTemplate = (rowData) => {
        return rowData.about_me
  
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
    const is_communeTemplate = (rowData) => {
        return(
            <span
            className={`badge badge-success bg-success`}
          >
    {rowData.is_commune == true ? 'Oui': ''}
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
            <Button label="Enregistrer" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
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
                    <Column sortable field="commune" header="commune" body={communeBodyTemplate}   style={{ minWidth: '5rem' }}></Column>
                    <Column sortable field="quartier" header="Quartier" body={quartierTemplate}  style={{ minWidth: '15rem' }}></Column>
                  
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '1rem' }}></Column>
                </DataTable>
            </div>

            <Dialog visible={productDialog} style={{ width: '450px' }} header="Affectation" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                {product.image && <img src={`images/product/${product.image}`} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={product.image} className="product-image block m-auto pb-3" />}
                <div className="field">
                    <label htmlFor="commune">commune</label>
                    <Dropdown id="commune"  value={selectedcommune} options={communes} onChange={(e) => onCityChangecommune(e, 'commune')} optionLabel="name" placeholder="commune" className={classNames({ 'p-invalid': submitted && !product.commune })} />
                  {submitted && !product.commune && <small className="p-error">commune is required.</small>}
                </div>

   
       

                <div className="field">
                    
                    <label htmlFor="quartier">Quartier</label>
                    {submitted && tags.length<1 && <small className="p-error">Quartier is required.</small>}
              
                    <ReactTags
                        tags={tags}
                        id="quartier"
    
                        delimiters={delimiters}
                        handleDelete={handleDelete}
                        handleAddition={handleAddition}
                        handleDrag={handleDrag}
                        handleTagClick={handleTagClick}
                        inputFieldPosition="bottom"
                        className={classNames({ 'p-invalid ': submitted && tags.length<1})}
                        autocomplete
                    />

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

export default DataTableCrudAffectationsQ