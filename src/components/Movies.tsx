import { useEffect, useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import { api } from '../lib/api'
import { ColumnDef, useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';

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

  useEffect(() => {           
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

}, [skip, take])

  const handleWithNextPage = () => {
    setSkip(skip + take);
  }

  const handleWithPreviousPage = () => {   
    setSkip(skip - take);
  }

  const takingCurrentPage = (take: number) => {
    setCurrentPage(Math.ceil(skip / take) + 1);     
  }

  const columns: ColumnDef<Movie>[] = [
    {
      accessorKey: 'name',
      header: 'Nome',   
    },  
    {
      accessorKey: 'description',
      header: 'Descrição',    
    },
    {
      accessorKey: 'views',
      header: 'Visualizações',    
    },
    {
      accessorKey: 'isPublished',
      header: 'Publicado',    
    },  
  ]
  
  const table = useReactTable({
    data: movies,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })


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
      
      <div>
        <table className="w-full text-sm text-center">
          <thead className="text-sm text-gray-100 uppercase bg-blue-500">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th className="" key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr className="text-white border-b bg-gray-800 border-gray-700 odd:bg-white even:bg-gray-50 odd:bg-gray-800
              even:bg-gray-700  md:transition-all ease-in-out delay-10 hover:-translate-y-1 hover:scale-109 hover:bg-blue-500 duration-300" key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td className="px-6 py-4 border border-slate-600 dark:border-slate-600" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>      
        </table>  
      </div>
    </>
  )
}