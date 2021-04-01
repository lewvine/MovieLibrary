using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebAPISample.Data;
using WebAPISample.Models;

namespace WebAPISample.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MovieController : ControllerBase
    {
        private ApplicationContext _context;
        public MovieController(ApplicationContext context)
        {
            _context = context;
        }
        // GET api/movie
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                // Retrieve all movies from db logic
                return Ok(new string[] { "movie1 string", "movie2 string" });
            }
            catch
            {
                return StatusCode(500);
            }
            
        }

        // GET api/movie/5
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            try
            {
                // Retrieve movie by id from db logic
                // return Ok(movie);
                return Ok();
            }
            catch
            {
                return StatusCode(500);
            }
        }

        // POST api/movie
        [HttpPost]
        public IActionResult Post([FromBody]Movie value)
        {
            try
            {
                // Create movie in db logic
                return Ok();
            }
            catch
            {
                return StatusCode(500);
            }
        }

        // PUT api/movie
        [HttpPut]
        public IActionResult Put([FromBody] Movie movie)
        {
            try
            {
                // Update movie in db logic
                return Ok();
            }
            catch
            {
                return StatusCode(500);
            }
        }

        // DELETE api/movie/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            try
            {
                // Delete movie from db logic
                return Ok();
            }
            catch
            {
                return StatusCode(500);
            }
        }
    }
}