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
  const [take , setTake] = useState(10) as any ; 
  const [skip , setSkip] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [previousButton, setPreviousButton] = useState(false);
  const [nextButton, setNextButton] = useState(false); 
  const [refreshKey, setRefreshKey] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [views, setViews] = useState('');
  const [modalIsOpen, setIsOpen] = useState(false);

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

  const handleSubmitMovie = (event: FormEvent) => {
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
      <div className="py-2 bg-blue-700 flex items-center sm:px-6 dark:bg-blue-700">        
        <div className="hidden sm:flex-1 sm:flex justify-center">       
          <div>     
            <button className="px-2 ml-2 mr-2 py-2 bg-blue-800 text-white text-sm
                leading-tight uppercase rounded shadow-md hover:bg-blue-600 hover:shadow-lg focus:bg-blue-900 focus:shadow-lg
                focus:outline-none focus:ring-0 active:bg-blue-900 active:shadow-lg transition duration-150 ease-in-out" 
                onClick={openModal}>Registrar Filme
            </button>
            <Modal
              style={customStyles}
              isOpen={modalIsOpen}          
              onRequestClose={closeModal}       
              contentLabel="Registrar novo filme"
            >            
              <button onClick={closeModal}><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg></button>
              <div className="w-full max-w-xs">
                <form onSubmit={handleSubmitMovie} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" >
                      Nome
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
                    type="submit"
                      >Registrar Filme
                  </button>              
                </form>               
              </div>
            </Modal>

            <span className="mr-2 bg-gray-700 border border-gray-600 text-gray-100 px-2 py-0.5 
              rounded text-center">           
              Exibir                  
              <select onChange={(event => {
                  setTake(event.target.value)
                })} className="inline-block px-2 ml-2 uppercase
                bg-gray-800 border border-gray-600 text-gray-100 bg-clip-padding bg-no-repeat border border-gray-300 
                rounded transition 
                focus:text-gray-100 focus:outline-none text-center">                   
                <option className="text-gray-100 text-center" value={'10'}>10</option>        
                  <option className="text-gray-100 text-center" value={'20'}>20</option> 
                  <option className="text-gray-100 text-center" value={'25'}>30</option>                                
                </select>                
            </span>            
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
        </div>
      </div> 

      <table className="w-full text-sm text-center">               
        <thead className="text-sm text-gray-100 uppercase bg-blue-500">
          <tr>                                
            <th className="text-md">Título</th>
            <th className="text-md">Descrição</th>
            <th className="text-md">Visualizações</th>
            <th className="text-md">Data de Envio</th>   
            <th className="text-md">Ações</th>           
          </tr>
        </thead>
        <tbody>
          {movies.map((movie: Movie) => (                   
        <tr className="text-white border-b bg-gray-800 border-gray-700 odd:bg-white even:bg-gray-50 odd:bg-gray-800
          even:bg-gray-700  md:transition-all ease-in-out delay-10 hover:bg-blue-500 duration-300" key={movie.id}>                         
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
          <td className="px-6 py-4 border-slate-600 dark:border-slate-600"> 
            <button                          
              onClick={() => handleWithDelete(movie.id)}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border bg-gray-300 hover:bg-gray-700  
              text-gray-500 hover:bg-blue-200"
              >             
              <TrashIcon className="h-5 w-5" aria-hidden="true" />
            </button>   
          </td>                                           
        </tr>                 
        ))}
        </tbody>                
      </table>      
    </>
  )
}