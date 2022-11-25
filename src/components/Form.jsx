import React, { Component } from "react";
import Modal from "./Modal";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class Form extends Component {

    constructor(props) {
      super(props)
      this.state = {
        values: {
            id: '',
            name: '',
            sdt: '',
            email: '',
        },

        errors: {
            id: '',
            name: '',
            sdt: '',
            email: '',
        },

        listSV: [],
        editSV: {
            id: '',
            name: '',
            sdt: '',
            email: '',
        },
        isOpenModal: false,
        searchSV: '',
        valid: false,
      }
    }

    componentDidMount () {
        this.getLocalStorage();
    }

    setLocalStorage = () => {
        const arrListSV = JSON.stringify(this.state.listSV);
        localStorage.setItem("arrListSV", arrListSV);
    }

    getLocalStorage = () => {
        if (localStorage.getItem("arrListSV")) {
            this.setState({listSV: JSON.parse(localStorage.getItem("arrListSV"))})
        }
    }


    isValid = () => {
        const {values, errors} = this.state;

        for (let key in errors) {
            if (errors[key] !== '' || values[key] == '') {
                return false;
            }
        }
        return true;
    }

    
    handleInputChange = (e) => {
        const {id, name, value} = e.target;
        const type = e.target.getAttribute('data-type');
        let newValues = this.state.values;
        newValues[id] = value;
        let newErrors = this.state.errors;
        let messError = '';
        let newListSV = this.state.listSV;
        for (let value of newListSV) {
            if(newValues.id === value.id) {
                messError = 'Mã SV đã tồn tại'
            }
            newErrors.id = messError;
        }

        if (value.trim() === '') {
            messError = name + ' không được bỏ trống'
        } else if(type === 'email') {
            let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (!value.match(regexEmail)) {
                messError = name + " không hợp lệ"
            } else {
                messError = ''
            }
        } else if (type === 'text') {
            let regexText = "^[a-zA-Z_ÀÁÂÃÈÉÊẾÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶ" + "ẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợ" + "ụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\s]+$";
            if (!value.match(regexText)) {
                messError = name + " không hợp lệ"
            } else {
                messError = ''
            }
        } else if (type === 'number') {
            let regexNumber = /^[0-9]+$/;
            if(!value.match(regexNumber)) {
                messError = name + " không hợp lệ"
            } else {
                messError = '';
            }
        }
        newErrors[id] = messError;

        this.setState({
            values: newValues,
            errors: newErrors,
        }, () => {
            this.setState({valid: this.isValid()})
        })

    }

    
    handleSubmit = (e) => {
        e.preventDefault();
        const isValid = this.isValid();
        if(!isValid){
            return;
        } else{ 
            const currentList = {...this.state.values};
            // const currentStudent = Object.assign({}, this.state.values);
            const newList = this.state.listSV.concat(currentList);
            this.setState({
                listSV: newList,
            }, () => {
                this.setState({values: {id: '', name: '', sdt: '', email: ''}, valid: false})
                this.setLocalStorage();
                e.target.reset();
            })

            toast.success('Thêm sinh viên thành công', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: "light",
                });
        }
    }

    handleSearchInput = (e) => {
        let {value} = e.target;
        this.setState({searchSV: this.toLowerCaseNonAccentVietnamese(value)})
    }


    deleteSV = (value) => {
        let newListSV = this.state.listSV;

        this.setState({listSV: newListSV.filter(sv => sv.id !== value.id)}, () => {this.setLocalStorage()})
        toast.success('Xóa sinh viên thành công', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
    }
    
    editSV = (value) => {
        this.setState({editSV: value, isOpenModal: true});
    }

    isOpenModal = (val) => {
        this.setState({isOpenModal: val})
    } 

    handleEditSV = (sv) => {
        let index = -1;
        this.state.listSV.forEach((val, i) => {
            if(val.id === sv.id) {
                index = i
            }
        })
        this.state.listSV[index] = sv;
        toast.success('Cập nhật sinh viên thành công', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
        this.setLocalStorage();
    }

    toLowerCaseNonAccentVietnamese = (str) => {
        str = str.toLowerCase();
    
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        // Some system encode vietnamese combining accent as individual utf-8 characters
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng 
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
        return str;
    };

  render() {
    return  <div className="wrapper mt-4">
        <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover={false}
            theme="light"
            />
        {this.state.isOpenModal && <Modal currentUser={this.state.editSV} isOpenModal={this.isOpenModal} editUser={this.handleEditSV}/>}
        <h1 className="text-center" style={{fontWeight: 700}}>35E - Nguyễn Đức Long - React Form</h1>
        <form className="mt-5" onSubmit={this.handleSubmit}>
            <h4 className="text-center mb-3" style={{fontWeight: 700}}>Thông tin sinh viên</h4>
            <div className="form row">
                <div className="col-6 mb-2 d-flex flex-column" style={{height: '90px'}}>
                    <label htmlFor="id">Mã SV</label>
                    <input type="number" id="id" name="Mã SV" onInput={this.handleInputChange}/>
                    {this.state.errors.id ? <div className="text text-danger error">{this.state.errors.id}</div> : ''}
                </div>
                <div className="col-6 mb-2 d-flex flex-column" style={{height: '90px'}}>
                    <label htmlFor="name">Họ tên</label>
                    <input data-type='text' type="text" id="name" name="Họ tên" onInput={this.handleInputChange}/>
                    {this.state.errors.name ? <div className="text text-danger error">{this.state.errors.name}</div> : ''}
                </div>
                <div className="col-6 mb-2 d-flex flex-column" style={{height: '90px'}}>
                    <label htmlFor="sdt">Số điện thoại</label>
                    <input data-type='number' type="text" id="sdt" name="Số điện thoại" onInput={this.handleInputChange}/>
                    {this.state.errors.sdt ? <div className="text text-danger error">{this.state.errors.sdt}</div> : ''}
                </div>
                <div className="col-6 mb-2 d-flex flex-column" style={{height: '90px'}}>
                    <label htmlFor="email">Email</label>
                    <input data-type='email' type="email" id="email" name="Email" onInput={this.handleInputChange}/>
                    {this.state.errors.email ? <div className="text text-danger error">{this.state.errors.email}</div> : ''}
                </div>
            </div>

            <button type="submit" className="btnSubmit d-flex mt-4" disabled={!this.state.valid} >Thêm sinh viên</button>
        </form>

        <div className="search mt-5">
            <input type="text" id="search" name="search" placeholder="Nhập tên cần tìm" onChange={this.handleSearchInput}/>
        </div>
        <table className="table mt-2">
            <thead>
                <tr>
                    <th>Mã SV</th>
                    <th>Họ tên</th>
                    <th>Số điện thoại</th>
                    <th>Email</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {this.state.listSV.filter((value) => {
                    return this.state.searchSV.toLowerCase() === '' ? value : this.toLowerCaseNonAccentVietnamese(value.name).includes(this.state.searchSV)
                }).map((value, i) => {
                    return (
                    <tr key={i}>
                        <td>{value.id}</td>
                        <td>{value.name}</td>
                        <td>{value.sdt}</td>
                        <td>{value.email}</td>
                        <td>
                            <span className="fa-solid fa-user-pen mr-3 edit" onClick={() => {this.editSV(value)}} data-toggle="modal" data-target="#myModal" data-backdrop="static"></span>
                            <span className="fa-solid fa-trash delete" onClick={() => {this.deleteSV(value)}}></span>
                        </td>
                    </tr>
                    );
                })}
            </tbody>
        </table>
    </div>
    
  }
}
