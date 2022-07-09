import { FormEvent, useEffect, useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, TrashIcon } from '@heroicons/react/solid';
import Modal from 'react-modal';
import { api } from '../lib/api';

type Movie = {
  id: string;
  title: string;
  description: string;
  views: string;
  published: string ;
}

export function Movies () {
  const [movies, setMovies] = useState([]);
  const take = 13;
  const [skip , setSkip] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [previousButton, setPreviousButton] = useState(false);
  const [nextButton, setNextButton] = useState(false); 
  const [refreshKey, setRefreshKey] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [views, setViews] = useState('');
  const [modalIsOpen, setIsOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [id, setId] = useState('');

  const openModal = () => {
    setIsOpen(true);
  }

  const closeModal = () => {
    setIsOpen(false);
  }

  useEffect(() => {        
    async function fetchData(){
      api.get(`/movies?take=${take}&skip=${skip}`)     
      .then(response => {         
        setMovies(response.data[0])   

        takingCurrentPage(take);
        
        if (skip < take) {
          setPreviousButton(true)        
        } else {
          setPreviousButton(false)        
        }   
        if (response.data[0].length < take) {
          setNextButton(true)        
        } else {
          setNextButton(false)        
        }
      })   
  }
  fetchData();   

}, [skip, take, refreshKey])

  const handleWithNextPage = () => {
    setSkip(skip + take);
  }

  const handleWithPreviousPage = () => {   
    setSkip(skip - take);
  }

  const takingCurrentPage = (take: number) => {
    setCurrentPage(Math.ceil(skip / take) + 1);     
  }

  const handleWithDelete = async (id: string) => {
    await api.delete(`/movies/${id}`)    
    return setRefreshKey(oldKey => oldKey +1)
  }  

  const handleWithSubmitMovie = (event: FormEvent) => {
    event.preventDefault();

    api.post('/movies', {
      title,
      description,
      views
    }).then(() => {
      
    closeModal();

    return setRefreshKey(oldKey => oldKey +1)
    })
  } 

  const handleWithUpdateMovie = (event: FormEvent) => {
    event.preventDefault();

    api.patch(`/movies/${id}`, {
      title,
      description,
      views
      }).then(() => {
      setIsUpdate(false);
      return setRefreshKey(oldKey => oldKey +1)
    })
  }

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

  return (
    <>      
      {isUpdate
    ? 
      <>         
        <div className="flex py-2 justify-center hover:h-full bg-blue-700 dark:bg-blue-700">           
          <form onSubmit={handleWithUpdateMovie} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" >
                Título
              </label>
              <input value={title} onChange={event => setTitle(event.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder={title} />
            </div>  
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" >
                Descrição
              </label>
              <input value={description} onChange={event => setDescription(event.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder={description} />
            </div> 
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" >
                Visualizações
              </label>
              <input value={views} onChange={event => setViews(event.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder={views} />
            </div>                   
            <button className="px-2 py-2 bg-blue-800 text-white text-sm
              leading-tight uppercase rounded shadow-md hover:bg-blue-600 hover:shadow-lg focus:bg-blue-900 focus:shadow-lg
              focus:outline-none focus:ring-0 active:bg-blue-900 active:shadow-lg transition duration-150 ease-in-out" 
              type="submit">
                Enviar
            </button>              
          </form>             
        </div>     
      </> 
      : 
      <>
        <div className="flex py-2 bg-blue-700 flex dark:bg-blue-700">        
        <button className="px-2 m-2 bg-gray-700 text-white text-sm
          leading-tight uppercase rounded shadow-md hover:bg-gray-600 hover:shadow-lg focus:bg-blue-900 focus:shadow-lg
          focus:outline-none focus:ring-0 active:bg-blue-900 active:shadow-lg transition duration-150 ease-in-out py-2" 
          onClick={openModal}>Registrar Filme
        </button>

        <Modal
            style={customStyles}
            isOpen={modalIsOpen}          
            onRequestClose={closeModal}   
          >            
          <button onClick={closeModal}><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg></button>
          <div className="w-full max-w-xs">
            <form onSubmit={handleWithSubmitMovie} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" >
                  Título
                </label>
                <input onChange={event => setTitle(event.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Título" required/>
              </div>  
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" >
                  Descrição
                </label>
                <input onChange={event => setDescription(event.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Descrição" required/>
              </div> 
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" >
                  Visualizações
                </label>
                <input onChange={event => setViews(event.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Visualizações" />
              </div>                   
              <button className="px-2 py-2 bg-blue-800 text-white text-sm
                leading-tight uppercase rounded shadow-md hover:bg-blue-600 hover:shadow-lg focus:bg-blue-900 focus:shadow-lg
                focus:outline-none focus:ring-0 active:bg-blue-900 active:shadow-lg transition duration-150 ease-in-out" 
                type="submit">
                  Enviar
              </button>              
            </form>               
          </div>
        </Modal>             
            
        <nav className="relative z-0 inline-flex rounded-md shadow-sm flex space-x-2" aria-label="Pagination">
          <button 
            disabled={previousButton}              
            onClick={() => handleWithPreviousPage()}
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border bg-white  
            text-gray-500 hover:bg-blue-200"
          >
            <span className="sr-only">Previous</span>
            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
          </button>              
          <a                  
            aria-current="page"
            className="z-10 bg-indigo-50 text-gray-800 relative inline-flex items-center px-4 py-2
            border text-sm rounded"
          >
            {currentPage}
          </a>                    
          <button
            disabled={nextButton}
            onClick={() => handleWithNextPage()}
            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 
            bg-white text-sm text-gray-500 hover:bg-blue-200"
          >             
            <span className="sr-only">Next</span>
            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </nav>          
      </div>

        <table className="w-full text-sm text-center">               
          <thead className="text-sm text-gray-100 uppercase bg-blue-500">
            <tr> 
              <th className="text-md">Ações</th>                                 
              <th className="text-md">Título</th>
              <th className="text-md">Descrição</th>
              <th className="text-md">Visualizações</th>
              <th className="text-md">Data de Envio</th> 
            </tr>
          </thead>
          <tbody>
            {movies.map((movie: Movie) => (                   
          <tr className="text-white border-b bg-gray-800 border-gray-700 odd:bg-white even:bg-gray-50 odd:bg-gray-800
            even:bg-gray-700  md:transition-all ease-in-out delay-10 hover:bg-blue-500 duration-300" key={movie.id}>
            <td className="px-6 py-4 border-slate-600 dark:border-slate-600"> 

              <button className="px-2 m-2 bg-blue-700 text-white text-sm
                leading-tight uppercase rounded shadow-md hover:bg-gray-600 hover:shadow-lg focus:bg-blue-900 focus:shadow-lg
                focus:outline-none focus:ring-0 active:bg-blue-900 active:shadow-lg transition duration-150 ease-in-out py-2"      
                onClick={() => {  
                  setIsUpdate(true);
                  setId(movie.id);             
                  setTitle(movie.title)
                  setDescription(movie.description)
                  setViews(movie.views)                  
                }}         
                ><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" />
                </svg>
              </button>

              <button                          
                onClick={() => handleWithDelete(movie.id)}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border bg-red-500 hover:bg-gray-700  
                text-gray-100 hover:bg-blue-200"
                >             
                <TrashIcon className="h-5 w-5" aria-hidden="true" />
              </button>  

            </td>                         
            <td className="px-6 py-4 border border-slate-600 dark:border-slate-600">
              {movie.title}
            </td>        
            <td className="px-6 py-4 border border-slate-600 dark:border-slate-600"> 
              {movie.description}
            </td>       
            <td className="px-6 py-4 border border-slate-600 dark:border-slate-600">
              {movie.views}
            </td>               
            <td className="px-6 py-4 border border-slate-600 dark:border-slate-600"> 
              {new Intl.DateTimeFormat("pt-BR", {}).format(
              new Date(movie.published))}
            </td> 
          </tr>                 
          ))}
          </tbody>                
        </table> 
      </>    
     } 
    </>        
  )
}