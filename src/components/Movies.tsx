import { useEffect, useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, TrashIcon } from '@heroicons/react/solid';
import { api } from '../lib/api'

type Movie = {
  id: string
  name: string
  description: string
  views: string
  isPublished: boolean 
}

export function Movies () {
  const [movies, setMovies] = useState([]) 
  const [take , setTake] = useState(10) as any  
  const [skip , setSkip] = useState(0)
  const [currentPage, setCurrentPage] = useState(0);
  const [previousButton, setPreviousButton] = useState(false);
  const [nextButton, setNextButton] = useState(false); 
  const [refreshKey, setRefreshKey] = useState(0);

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

  return (
    <>  
      <div className="py-2 bg-blue-700 flex items-center sm:px-6 dark:bg-blue-700">        
        <div className="hidden sm:flex-1 sm:flex justify-center">       
          <div>
            <span className="mr-2 bg-gray-700 border border-gray-600 text-gray-100 px-2 py-0.5 
              rounded text-center">           
              Exibir                  
              <select onChange={(event => {
                  setTake(event.target.value)
                })} className="inline-block px-2 ml-2 uppercase
                bg-gray-800 border border-gray-600 text-gray-100 bg-clip-padding bg-no-repeat border border-gray-300 
                rounded transition 
                focus:text-gray-100 focus:outline-none text-center">                           
                  <option className="text-gray-100 text-center" value={'15'}>15</option> 
                  <option className="text-gray-100 text-center" value={'45'}>30</option>                                
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
            <th className="text-md">Data de Envio</th>                     
            <th className="text-md">Nome</th>
            <th className="text-md">Email</th>
            <th className="text-md">Observação</th>  
            <th className="text-md">Ações</th>           
          </tr>
        </thead>
        <tbody>
          {movies.map((movie: Movie) => (                   
        <tr className="text-white border-b bg-gray-800 border-gray-700 odd:bg-white even:bg-gray-50 odd:bg-gray-800
          even:bg-gray-700  md:transition-all ease-in-out delay-10 hover:-translate-y-1 hover:scale-109 hover:bg-blue-500 duration-300" key={movie.id}>                         
          <td className="px-6 py-4 border border-slate-600 dark:border-slate-600">
            {movie.name}
          </td>        
          <td className="px-6 py-4 border border-slate-600 dark:border-slate-600"> 
            {movie.description}
          </td>       
          <td className="px-6 py-4 border border-slate-600 dark:border-slate-600">
            {movie.views}
          </td>               
          <td className="px-6 py-4 border border-slate-600 dark:border-slate-600"> 
            {movie.isPublished ? 'Sim' : 'Não'}
          </td>  
          <td className="px-6 py-4 border border-slate-600 dark:border-slate-600"> 
            <button                          
              onClick={() => handleWithDelete(movie.id)}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border bg-white  
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